#!/bin/bash
WORK_DIR="/root/cf-speedtest"
cd $WORK_DIR

# --- Cloudflare 域名参数配置 ---
CF_API_TOKEN="cfut_LVx5z1hNuRTxuAncHK8YWPniuRZ4og8FCFVyOXDU69c07a73"
CF_ZONE_ID="7ec4a9b70983ceced218c7bbfab590b6"
CF_RECORD_ID="7df94461ebc08fd98a270934959f9d22"
CF_RECORD_NAME="ip.hii.pp.ua"
# ----------------------------

# 代理设置（确保能连上 API 和 GitHub）
export http_proxy="http://127.0.0.1:2080"
export https_proxy="http://127.0.0.1:2080"

echo "========== 开始优选测速 =========="
# 测速 500 个 IP，只要下载速度 5MB/s 以上的
./cfst -n 1000 -t 4 -sl 5 -o result.csv

# 提取排名第一的最优 IP
BEST_IP=$(awk -F, 'NR==2 {print $1}' result.csv)

if [ -n "$BEST_IP" ]; then
    echo "最优 IP 为: $BEST_IP，正在更新 DNS 记录..."
    
    # 修改 API 请求，将 content 替换为最新优选 IP
    curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$CF_RECORD_ID" \
         -H "Authorization: Bearer $CF_API_TOKEN" \
         -H "Content-Type: application/json" \
         --data "{\"type\":\"A\",\"name\":\"$CF_RECORD_NAME\",\"content\":\"$BEST_IP\",\"ttl\":60,\"proxied\":false}"
    
    echo -e "\n域名 ip.hii.pp.ua 已经成功指向 $BEST_IP"
fi

# 同步 GitHub (作为双保险备份)
rm -f best_nodes.txt
awk -F, 'NR>1 {print $1 "," toupper($7)}' result.csv | head -n 5 | while IFS=, read ip colo; do
    echo "${ip}:443#${colo}-HiNAS" >> best_nodes.txt
done

git add .
git commit -m "IP & DNS Sync: $BEST_IP"
git push origin main
echo "========== 任务圆满结束 =========="
