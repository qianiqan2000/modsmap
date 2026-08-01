FROM node:20-slim

WORKDIR /app

# 1. 复制依赖清单并安装
COPY package*.json ./
RUN npm install

# 2. 复制项目所有代码
COPY . .

# 3. 编译前端静态文件（如果项目需要构建）
RUN npm run build || true

# 暴露后端/全栈服务端口
EXPOSE 3000

# 启动服务端 node 进程（启动 server.ts）
CMD ["npx", "tsx", "server.ts"]
