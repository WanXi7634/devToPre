const data = [{
        name: 'fundpro --- 升级预环境',
        isMerge: false,
        path: 'C:\\Users\\zyyx\\Desktop\\zyyx\\fund-project\\fundpro'
    },
    {
        name: 'zyfp-fof --- 升级预环境',
        isMerge: false,
        path: 'C:\\Users\\zyyx\\Desktop\\zyyx\\fund-project\\zyfp-fof-web'
    },
    {
        name: 'bestfunds --- 升级预环境',
        isMerge: false,
        path: 'C:\\Users\\zyyx\\Desktop\\zyyx\\fund-project\\bestfunds'
    },
    {
        name: 'zyfp-amp --- 升级预环境',
        isMerge: false,
        path: 'C:\\Users\\zyyx\\Desktop\\zyyx\\fund-project\\zyfp-amp-web'
    }
];

const switchInput = document.getElementById('switchInput');
const manualInputSection = document.getElementById('manualInputSection');
const presetSection = document.getElementById('presetSection');
const projectPath = document.getElementById('projectPath');
const mergeButtonManual = document.getElementById('mergeButtonManual');
const loadingManual = document.getElementById('loadingManual');
const presetProjects = document.getElementById('presetProjects');

switchInput.addEventListener('change', () => {
    if (switchInput.checked) {
        manualInputSection.style.display = 'block';
        presetSection.style.display = 'none';
    } else {
        manualInputSection.style.display = 'none';
        presetSection.style.display = 'block';
    }
});

mergeButtonManual.addEventListener('click', () => {
    if (!projectPath.value) {
        alert('请输入项目路径');
        return;
    }
    mergeButtonManual.disabled = true;
    loadingManual.style.display = 'block';
    ipcRenderer.send('start-merge', projectPath.value);
});

data.forEach(item => {
    const projectDiv = document.createElement('div');
    projectDiv.className = 'p-box';
    projectDiv.innerHTML = `
        <label class="label">${item.name}</label>
        <button class="btn" onclick="handlePresetMerge('${item.path}', this)">${item.isMerge ? '正在合并...' : item.name}</button>
    `;
    presetProjects.appendChild(projectDiv);
});

// window.handlePresetMerge = (path, button) => {
//     button.disabled = true;
//     button.innerText = '正在合并...';
//     ipcRenderer.send('start-merge', path);
// };

// ipcRenderer.on('merge-result', (event, arg) => {
//     loadingManual.style.display = 'none';
//     mergeButtonManual.disabled = false;
//     alert('合并成功');
// });
window.handlePresetMerge = (path, button) => {
    button.disabled = true;
    button.innerText = '正在合并...';
    window.electron.ipcRenderer.send('start-merge', path);
};
console.log(window.electron);

window.electron.ipcRenderer.on('merge-result', (event, arg) => {
    loadingManual.style.display = 'none';
    mergeButtonManual.disabled = false;
    alert('合并成功');
});

// document.getElementById('mergeButton').addEventListener('click', () => {
//     const projectPath = document.getElementById('projectPath').value;
//     const mergeButton = document.getElementById('mergeButton');
//     const loading = document.getElementById('loading');
//     if (!projectPath.trim()) {
//         alert('请输入项目路径');
//         return;
//     }
//     // 显示加载动画
//     mergeButton.disabled = true;
//     loading.style.display = 'block';
//     // 发送合并请求
//     ipcRenderer.send('start-merge', projectPath);
// });

// ipcRenderer.on('merge-result', (event, result) => {
//     const mergeButton = document.getElementById('mergeButton');
//     const loading = document.getElementById('loading');

//     // 隐藏加载动画
//     mergeButton.disabled = false;
//     loading.style.display = 'none';

//     // 显示结果
//     alert(result);
// });