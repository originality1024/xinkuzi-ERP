import subprocess
extension_path = r'Tools_SelectProducts\edge'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
# 构建命令
command = [edge_path, f'--load-extension={extension_path}']
try:
    # 启动 Edge 浏览器并加载扩展
    print(extension_path)
    subprocess.Popen(command)
except Exception as e:
    print(f"发生错误: {e}")