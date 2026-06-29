import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/script/getList',
    method: 'get',
    response: () => {
      return {
        code: 200,
        msg: 'success',
        data: {
          description: `
                        <div style="padding: 20px; background: var(--el-fill-color-lighter); border-radius: 8px; margin: 10px 0; border: 1px solid var(--el-border-color-light);">
                            <h3 style="color: var(--el-text-color-primary); margin: 0 0 15px 0; font-size: 18px;">测试 Script 标签执行</h3>
                            <p style="color: var(--el-text-color-regular); margin: 0 0 20px 0; line-height: 1.6;">这是一个测试页面，用于验证 script 标签是否能正常执行。点击下方按钮测试交互功能。</p>
                            
                            <div id="script-test-result" style="margin: 15px 0; padding: 15px; background: var(--el-bg-color); border-radius: 6px; border: 1px solid var(--el-border-color);">
                                <strong style="color: var(--el-text-color-primary);">执行结果：</strong>
                                <span id="result-text" style="color: var(--el-text-color-regular); margin-left: 8px;">等待脚本执行...</span>
                            </div>
                            
                            <button id="test-button" style="padding: 8px 16px; background: var(--el-color-primary); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; transition: all 0.3s;">
                                点击测试按钮
                            </button>
                            
                            <script>
                                // 测试脚本1：显示执行时间
                                console.log('Script 标签执行成功！时间：', new Date().toLocaleString());
                                
                                // 测试脚本2：更新页面内容
                                setTimeout(() => {
                                    const resultText = document.getElementById('result-text');
                                    if (resultText) {
                                        resultText.textContent = '脚本执行成功！时间：' + new Date().toLocaleString();
                                        resultText.style.color = 'var(--el-color-success)';
                                        resultText.style.fontWeight = 'bold';
                                    }
                                }, 1000);
                                
                                // 测试脚本3：添加事件监听
                                setTimeout(() => {
                                    const testButton = document.getElementById('test-button');
                                    if (testButton) {
                                        testButton.addEventListener('click', function() {
                                            alert('按钮点击事件触发成功！Script 标签正常工作。');
                                        });
                                        
                                        // 添加悬停效果
                                        testButton.addEventListener('mouseenter', function() {
                                            this.style.background = 'var(--el-color-primary-light-3)';
                                        });
                                        
                                        testButton.addEventListener('mouseleave', function() {
                                            this.style.background = 'var(--el-color-primary)';
                                        });
                                    }
                                }, 1500);
                                
                                // 测试脚本4：动态创建元素
                                setTimeout(() => {
                                    const container = document.getElementById('script-test-result');
                                    if (container) {
                                        const newElement = document.createElement('div');
                                        newElement.style.cssText = \`
                                            margin-top: 15px;
                                            padding: 12px;
                                            background: var(--el-fill-color);
                                            border-radius: 4px;
                                            border-left: 4px solid var(--el-color-info);
                                            font-size: 14px;
                                            line-height: 1.5;
                                        \`;
                                        newElement.innerHTML = '<strong style="color: var(--el-text-color-primary);">动态创建的元素：</strong> <span style="color: var(--el-text-color-regular);">这个元素是通过 script 标签动态创建的！</span>';
                                        container.appendChild(newElement);
                                    }
                                }, 2000);
                            </script>
                        </div>
                    `,
        },
      }
    },
  },
] as MockMethod[]
