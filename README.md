# xinkuzi-ERP
轻量化跨境电商ERP系统

文件结构（预）
xinkuzi-ERP/
├── client/                 ⭐ 前端核心
│   ├── src/
│   │   ├── css/           # 全局样式/预处理样式
│   │   │   ├── _variables.scss  # SCSS变量
│   │   │   └── main.css   # 编译后样式
│   │   └── html/          # 多页面模板
│   │       ├── portal/    # 门户
│   │       └── admin/     # 后台
│   ├── public/            # 静态资源
├── servers/                ⭐ 多语言后端服务
│   ├── nodejs/            # JS服务 
│   │   └── src/           # 原server目录内容
│   ├── python/            # Python服务
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── config/    # 配置类
│   │   │   ├── routes/    # FastAPI/Flask路由
│   │   │   └── services/  # 业务服务层
│   │   └── requirements.txt
│   └── php/              # PHP服务
│       ├── public/        # Web根目录
│       └── src/
│           ├── Controllers/
│           ├── Models/
│           └── Utils/
├── shared/                ⭐ 跨语言共享
│   ├── protos/           # gRPC协议文件
│   ├── contracts/        # API契约(OpenAPI)
│   └── libs/             # 多语言工具库
├── docker/               ⭐ 容器化配置
│   ├── nodejs.dockerfile
│   ├── python.dockerfile
│   └── php.dockerfile
├── scripts/               ⭐ 脚本
│   ├── tools/            # 工具脚本