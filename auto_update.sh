cat > /root/cf-speedtest/auto_update.sh << 'EOF'
#!/bin/bash

# 1. 切换目录 
WORK_DIR="/root/cf-speedtest"
cd $WORK_DIR

echo "========== $(date '+%Y-%m-%d %H:%M:%S') 开始测速 =========="
# 这里已经帮你改成了正确的 ./cfst
./cfst -n 200 -t 4 -o result.csv

echo "测速完成，开始生成节点文件..."
rm -f best_nodes.txt

# 读取 CSV 生成节点
awk -F, 'NR>1 {print $1}' result.csv | head -n 10 | while read ip; do
    echo "${ip}:443#HiNAS自动优选" >> best_nodes.txt
done

echo "节点生成完毕，开始推送到 GitHub..."
# 设置 Git 机器人身份
git config user.name "HiNAS-Bot"
git config user.email "bot@hinas.local"

git add result.csv best_nodes.txt
git commit -m "自动更新优选 IP: $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

echo "========== 全部任务圆满结束 =========="
EOF

