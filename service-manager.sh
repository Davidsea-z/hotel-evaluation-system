#!/bin/bash
# 电竞酒店投资评估系统 - 服务管理脚本

FRONTEND_PORT=8080
BACKEND_PORT=5000
FRONTEND_LOG="/tmp/frontend.log"
BACKEND_LOG="/tmp/backend.log"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}  电竞酒店投资评估系统 - 服务管理${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo ""
    echo "使用方法: $0 {start|stop|restart|status|logs}"
    echo ""
    echo "命令说明:"
    echo "  start   - 启动前端和后端服务"
    echo "  stop    - 停止前端和后端服务"
    echo "  restart - 重启前端和后端服务"
    echo "  status  - 查看服务运行状态"
    echo "  logs    - 查看服务日志"
    echo ""
}

# 检查服务状态
check_service() {
    local port=$1
    local service_name=$2
    
    if lsof -i:$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -tlnp 2>/dev/null | grep -q ":$port " || ss -tlnp 2>/dev/null | grep -q ":$port "; then
        local pid=$(lsof -i:$port -sTCP:LISTEN -t 2>/dev/null || netstat -tlnp 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1 | head -1)
        echo -e "${GREEN}✓${NC} $service_name 运行中 (端口: $port, PID: $pid)"
        return 0
    else
        echo -e "${RED}✗${NC} $service_name 未运行 (端口: $port)"
        return 1
    fi
}

# 启动服务
start_services() {
    echo -e "${BLUE}启动服务...${NC}"
    
    # 检查并启动前端服务
    if check_service $FRONTEND_PORT "前端服务" > /dev/null 2>&1; then
        echo -e "${YELLOW}前端服务已在运行${NC}"
    else
        cd /home/user/webapp
        nohup python3 -m http.server $FRONTEND_PORT > $FRONTEND_LOG 2>&1 &
        sleep 2
        check_service $FRONTEND_PORT "前端服务"
    fi
    
    # 检查并启动后端服务
    if check_service $BACKEND_PORT "后端服务" > /dev/null 2>&1; then
        echo -e "${YELLOW}后端服务已在运行${NC}"
    else
        cd /home/user/webapp/backend
        nohup python3 app.py > $BACKEND_LOG 2>&1 &
        sleep 3
        check_service $BACKEND_PORT "后端服务"
    fi
    
    echo ""
    echo -e "${GREEN}服务启动完成！${NC}"
    show_urls
}

# 停止服务
stop_services() {
    echo -e "${BLUE}停止服务...${NC}"
    
    # 停止前端服务
    local frontend_pid=$(lsof -i:$FRONTEND_PORT -sTCP:LISTEN -t 2>/dev/null)
    if [ ! -z "$frontend_pid" ]; then
        kill $frontend_pid 2>/dev/null
        echo -e "${GREEN}✓${NC} 前端服务已停止 (PID: $frontend_pid)"
    else
        echo -e "${YELLOW}前端服务未在运行${NC}"
    fi
    
    # 停止后端服务
    local backend_pids=$(lsof -i:$BACKEND_PORT -sTCP:LISTEN -t 2>/dev/null)
    if [ ! -z "$backend_pids" ]; then
        for pid in $backend_pids; do
            kill $pid 2>/dev/null
        done
        # 同时停止Flask的子进程
        pkill -f "python3 app.py" 2>/dev/null
        echo -e "${GREEN}✓${NC} 后端服务已停止 (PIDs: $backend_pids)"
    else
        echo -e "${YELLOW}后端服务未在运行${NC}"
    fi
    
    echo -e "${GREEN}服务停止完成！${NC}"
}

# 显示服务状态
show_status() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}        服务运行状态${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo ""
    
    check_service $FRONTEND_PORT "前端服务"
    check_service $BACKEND_PORT "后端API"
    
    echo ""
    echo -e "${BLUE}进程详情:${NC}"
    ps aux | grep -E "(http.server $FRONTEND_PORT|python3 app.py)" | grep -v grep | awk '{printf "  PID: %-6s CPU: %-5s MEM: %-5s CMD: %s\n", $2, $3"%", $4"%", substr($0, index($0,$11))}'
    
    echo ""
    show_urls
}

# 显示访问URL
show_urls() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}        访问地址${NC}"
    echo -e "${BLUE}======================================${NC}"
    echo ""
    echo -e "${GREEN}前端服务:${NC}"
    echo "  本地: http://localhost:$FRONTEND_PORT"
    echo "  公网: https://8080-ig8toylay0chypiqdgwt2-cbeee0f9.sandbox.novita.ai"
    echo ""
    echo -e "${GREEN}后端API:${NC}"
    echo "  本地: http://localhost:$BACKEND_PORT"
    echo "  公网: https://5000-ig8toylay0chypiqdgwt2-cbeee0f9.sandbox.novita.ai"
    echo "  健康检查: http://localhost:$BACKEND_PORT/api/health"
    echo ""
}

# 查看日志
show_logs() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}          前端服务日志${NC}"
    echo -e "${BLUE}======================================${NC}"
    tail -20 $FRONTEND_LOG 2>/dev/null || echo "无日志文件"
    
    echo ""
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}          后端服务日志${NC}"
    echo -e "${BLUE}======================================${NC}"
    tail -20 $BACKEND_LOG 2>/dev/null || echo "无日志文件"
}

# 主程序
case "$1" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        start_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    *)
        show_help
        exit 1
        ;;
esac

exit 0
