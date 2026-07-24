```markdown
### The Code Inspector V3.0
-by Gemini and the ghost writer
### Updated Codebase with Client-Side Blunder Compiler.
#### index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Code Inspector Pro</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-[#181825] text-[#cdd6f4] h-screen flex flex-col overflow-hidden">

  <!-- Header -->
  <header class="bg-[#11111b] border-b border-[#313244] px-6 py-3 flex items-center justify-between shrink-0">
    <div class="flex items-center gap-3">
      <div class="bg-gradient-to-tr from-[#cba6f7] to-[#89b4fa] p-2 rounded-lg text-[#11111b]">
        <i data-lucide="shield-check" class="w-5 h-5"></i>
      </div>
      <div>
        <h1 class="text-sm font-bold tracking-wider text-white uppercase flex items-center gap-2">
          The Code Inspector Pro <span class="text-[9px] bg-[#f9e2af] text-[#11111b] px-1 rounded">V3.5 Compiler-Edition</span>
        </h1>
        <p class="text-[10px] text-[#a6adc8]">Advanced Complexity, Dead-Code, & In-Memory Compiler Bundler</p>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <!-- Background Agent status toggle -->
      <div class="flex items-center gap-2 bg-[#1e1e2e] px-3 py-1 rounded border border-[#313244]">
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" id="bgMonitorToggle" class="sr-only peer" checked>
          <div class="w-7 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#a6e3a1]"></div>
        </label>
        <span class="text-[10px] text-[#a6adc8] font-medium uppercase tracking-wider">Background Daemon</span>
      </div>

      <div id="saveIndicator" class="hidden text-xs text-[#a6e3a1] items-center gap-1">
        <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Auto-Saved
      </div>
      <div id="statusBadge" class="flex items-center gap-2 bg-[#1e1e2e] px-3 py-1.5 rounded-md border border-[#313244] text-xs">
        <span id="statusPulse" class="w-2 h-2 rounded-full bg-[#a6e3a1]"></span>
        <span id="statusText" class="text-[#a6adc8] font-medium">System Idle</span>
      </div>
    </div>
  </header>

  <!-- Workspace Grid -->
  <div class="flex flex-1 overflow-hidden">
    
    <!-- Left Sidebar: Explorer -->
    <aside class="w-64 bg-[#11111b] border-r border-[#313244] flex flex-col shrink-0">
      <div class="p-4 border-b border-[#313244] flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-[#a6adc8] flex items-center gap-2">
          <i data-lucide="folder-tree" class="w-4 h-4 text-[#89b4fa]"></i> Workspace
        </span>
        <button id="addFileBtn" class="text-[#a6adc8] hover:text-white transition-colors" title="Create virtual sandbox file">
          <i data-lucide="file-plus" class="w-4 h-4"></i>
        </button>
      </div>

      <!-- File List -->
      <div id="fileList" class="flex-1 overflow-y-auto p-2 space-y-1">
        <!-- Dynamically loaded files go here -->
      </div>

      <!-- Workspace Rules Guard -->
      <div class="p-4 bg-[#181825] border-t border-[#313244] text-[11px] text-[#a6adc8] space-y-2">
        <div class="flex items-center gap-1.5 font-semibold text-white">
          <i data-lucide="info" class="w-3.5 h-3.5 text-[#f9e2af]"></i>
          <span>Background Fetch</span>
        </div>
        <p class="leading-relaxed">When active, the background daemon audits your active buffer automatically every 3 seconds of typing downtime.</p>
      </div>
    </aside>

    <!-- Center Pane: Editor -->
    <main class="flex-1 flex flex-col bg-[#1e1e2e] relative">
      <!-- Controls Header -->
      <div class="bg-[#11111b] border-b border-[#313244] px-4 py-2 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <i data-lucide="file-code" class="w-4 h-4 text-[#cba6f7]"></i>
          <span id="currentFileName" class="font-medium text-white">...</span>
          <span class="text-[#585b70]">|</span>
          <span id="fileLanguage" class="text-[#a6adc8] bg-[#313244] px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">html</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="formatBtn" class="bg-[#313244] hover:bg-[#45475a] text-white px-3 py-1 rounded flex items-center gap-1.5 transition-colors">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#f9e2af]"></i> Pretty-Print
          </button>
          <button id="analyzeBtn" class="bg-[#89b4fa] hover:bg-[#b4befe] text-[#11111b] font-semibold px-3 py-1 rounded flex items-center gap-1.5 transition-colors">
            <i data-lucide="cpu" class="w-3.5 h-3.5"></i> Run Inspector
          </button>
        </div>
      </div>

      <!-- Textarea with Line Gutter -->
      <div class="flex-1 flex overflow-hidden relative">
        <div id="lineNumbers" class="w-12 bg-[#11111b] text-[#585b70] text-right pr-3 pt-4 select-none code-font text-xs leading-6 overflow-hidden">
          1
        </div>
        <textarea id="editor" class="flex-1 bg-transparent text-[#cdd6f4] p-4 focus:outline-none resize-none code-font text-xs leading-6 overflow-y-auto whitespace-pre block" spellcheck="false" placeholder="// Write or paste code here..."></textarea>
      </div>
    </main>

    <!-- Right Sidebar: Interactive Diagnostic Dashboard & Live Compiler Preview -->
    <section class="w-96 bg-[#11111b] border-l border-[#313244] flex flex-col shrink-0">
      <div class="flex border-b border-[#313244] text-[11px] overflow-x-auto shrink-0">
        <button id="tabDashboardBtn" class="flex-1 py-3 px-1 text-center border-b-2 border-[#cba6f7] font-semibold text-white whitespace-nowrap">
          <i data-lucide="layout-dashboard" class="w-3.5 h-3.5 inline mr-1"></i> Dashboard
        </button>
        <button id="tabIssuesBtn" class="flex-1 py-3 px-1 text-center border-b-2 border-transparent text-[#a6adc8] hover:text-white font-semibold whitespace-nowrap">
          <i data-lucide="shield-alert" class="w-3.5 h-3.5 inline mr-1"></i> Diagnostics
        </button>
        <button id="tabAstBtn" class="flex-1 py-3 px-1 text-center border-b-2 border-transparent text-[#a6adc8] hover:text-white font-semibold whitespace-nowrap">
          <i data-lucide="code" class="w-3.5 h-3.5 inline mr-1"></i> AST
        </button>
        <button id="tabCompilerBtn" class="flex-1 py-3 px-1 text-center border-b-2 border-transparent text-[#a6adc8] hover:text-white font-semibold whitespace-nowrap bg-[#1e1e2e]">
          <i data-lucide="play-circle" class="w-3.5 h-3.5 inline mr-1 text-[#a6e3a1]"></i> Live Compiler
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        
        <!-- Tab 1: Dashboard Analytics -->
        <div id="tabDashboard" class="space-y-4">
          <!-- Main Health Dials -->
          <div class="bg-[#181825] border border-[#313244] rounded-lg p-3 space-y-3">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider">Health Metrics</h3>
            
            <!-- Maintainability Index -->
            <div class="space-y-1">
              <div class="flex justify-between text-[11px]">
                <span class="text-[#a6adc8]">Maintainability Index</span>
                <span id="maintainabilityScore" class="font-bold text-[#a6e3a1]">100/100</span>
              </div>
              <div class="w-full bg-[#313244] h-2 rounded-full overflow-hidden">
                <div id="maintainabilityBar" class="bg-[#a6e3a1] h-full transition-all duration-500" style="width: 100%"></div>
              </div>
            </div>

            <!-- Security Grade -->
            <div class="space-y-1">
              <div class="flex justify-between text-[11px]">
                <span class="text-[#a6adc8]">Security Health</span>
                <span id="securityScore" class="font-bold text-[#a6e3a1]">Excellent</span>
              </div>
              <div class="w-full bg-[#313244] h-2 rounded-full overflow-hidden">
                <div id="securityBar" class="bg-[#a6e3a1] h-full transition-all duration-500" style="width: 100%"></div>
              </div>
            </div>
          </div>

          <!-- Complexity & Size Breakdown -->
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-[#181825] p-3 rounded-lg border border-[#313244]">
              <div class="text-[10px] uppercase text-[#a6adc8]">Cyclomatic Complexity</div>
              <div id="complexityMetric" class="text-lg font-bold text-white mt-1">1</div>
            </div>
            <div class="bg-[#181825] p-3 rounded-lg border border-[#313244]">
              <div class="text-[10px] uppercase text-[#a6adc8]">Unused Variables</div>
              <div id="deadCodeMetric" class="text-lg font-bold text-white mt-1">0</div>
            </div>
          </div>

          <!-- Code footprint list -->
          <div class="bg-[#181825] border border-[#313244] rounded-lg p-3 space-y-2">
            <h4 class="text-xs font-bold text-white uppercase tracking-wider">Physical Workspace Payload</h4>
            <div class="grid grid-cols-2 gap-2 text-[11px]">
              <div class="text-[#a6adc8]">Lines Count: <span id="metricLines" class="text-white font-mono">0</span></div>
              <div class="text-[#a6adc8]">Byte Size: <span id="metricSize" class="text-white font-mono">0 B</span></div>
              <div class="text-[#a6adc8]">Total Chars: <span id="metricChars" class="text-white font-mono">0</span></div>
              <div class="text-[#a6adc8]">Est. Tokens: <span id="metricTokens" class="text-white font-mono">0</span></div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Security & Linter Issues -->
        <div id="tabIssues" class="space-y-4 hidden">
          <div class="bg-[#181825] border border-[#313244] rounded-lg p-3">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i data-lucide="shield-alert" class="w-4 h-4 text-[#f38ba8]"></i> Static Analysis Audit
            </h3>
            <div id="diagnosticLogs" class="space-y-2">
              <!-- Logs populated dynamically -->
            </div>
          </div>
        </div>

        <!-- Tab 3: Code Topology AST -->
        <div id="tabAst" class="space-y-4 hidden">
          <div class="bg-[#181825] border border-[#313244] rounded-lg p-3">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4 text-[#a6e3a1]"></i> AST Tree Map
            </h3>
            <div id="astTree" class="space-y-2 text-xs code-font">
              <!-- Dynamically rendered tokens and elements -->
            </div>
          </div>
        </div>

        <!-- Tab 4: Live Compiler Output Preview -->
        <div id="tabCompiler" class="space-y-4 hidden h-full flex flex-col">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <i data-lucide="play" class="w-4 h-4 text-[#a6e3a1]"></i> Executable Compiler Sandbox
            </h3>
            <button id="triggerBuildBtn" class="bg-[#a6e3a1] text-[#11111b] text-[11px] font-bold px-2 py-1 rounded flex items-center gap-1 hover:bg-[#89b4fa] transition-colors">
              <i data-lucide="refresh-cw" class="w-3 h-3"></i> Re-compile Project
            </button>
          </div>

          <!-- Live Build Output Console -->
          <div class="bg-[#11111b] border border-[#313244] rounded p-2 text-[10px] font-mono text-[#a6adc8] space-y-1 select-text">
            <div><span class="text-blue-400 font-bold">[BUILD COMPILER]</span> Analyzing file hierarchy...</div>
            <div id="compilerLogs" class="text-white">Ready to bundle project components.</div>
          </div>

          <!-- Runnable Sandboxed iframe preview screen -->
          <div class="flex-1 bg-white rounded-lg border-2 border-[#45475a] overflow-hidden min-h-[300px] flex flex-col relative">
            <div class="bg-[#313244] text-[10px] px-3 py-1 flex items-center justify-between text-white font-semibold">
              <span>Dynamic Window Output View</span>
              <span class="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            </div>
            <iframe id="compiledSandboxFrame" class="w-full flex-1 bg-white border-none" sandbox="allow-scripts"></iframe>
          </div>
        </div>

      </div>

      <!-- Footer Control Panel -->
      <div class="p-4 bg-[#11111b] border-t border-[#313244] space-y-2 shrink-0">
        <button id="minifyBtn" class="w-full bg-[#313244] hover:bg-[#45475a] text-white py-2 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all">
          <i data-lucide="minimize-2" class="w-4 h-4"></i> Safe-Minify Active Buffer
        </button>
      </div>
    </section>

  </div>

  <script src="app.js"></script>
</body>
</html>
#### styles.css
body {
  font-family: 'Inter', sans-serif;
}
.code-font {
  font-family: 'Fira Code', monospace;
}
/* Custom Smooth Transitions */
.transition-all {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
/* Scrollbars */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #1e1e2e;
}
::-webkit-scrollbar-thumb {
  background: #45475a;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #585b70;
}
#### app.js
// Default Sandboxed Virtual Environment
const defaultFiles = [
  {
    id: "app-js",
    name: "app.js",
    language: "javascript",
    content: // Code Inspector Pro Sandbox
const API_TOKEN_SECRET = "sk_prod_90a12fbc45de99ff"; // Security Warning
let activeFlag = true;
let unusedVariable = "I am dead code"; // Dead code warning

function runHeavyMath(payload) {
  let depth = 0;
  // Let's compute complex logic tree
  if (payload) {
    for(let i=0; i<10; i++) {
      if (i % 2 === 0) {
        depth++;
      } else {
        depth--;
      }
    }
  }
  return depth;
}

function renderHtml(userInput) {
  // Potentially dangerous XSS injection pathway
  document.getElementById("output").innerHTML = userInput;
}

  },
  {
    id: "index-html",
    name: "index.html",
    language: "html",
    content: <!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Security Check Sandbox</title>
</head>
<body>
  <div id="output">Rendering incoming data...</div>
  <!-- Inline handlers trigger rules -->
  <button onclick="runHeavyMath(true)">Activate</button>
</body>
</html>
  },
  {
    id: "styles-css",
    name: "styles.css",
    language: "css",
    content: /* Architecture Baseline */
:root {
  --primary: #cba6f7;
  --secondary: #89b4fa;
}

body {
  background-color: #11111b;
  color: #cdd6f4;
  margin: 0;
}
  }
];

// Load State from storage or fallback
let virtualFiles = JSON.parse(localStorage.getItem('code_inspector_files_v3')) || defaultFiles;
let currentFileIndex = 0;

// Background Daemon parameters
let daemonTimer = null;
let typingDebounceTimeout = null;

// UI Selector references
const fileListEl = document.getElementById('fileList');
const currentFileNameEl = document.getElementById('currentFileName');
const fileLanguageEl = document.getElementById('fileLanguage');
const editorEl = document.getElementById('editor');
const lineNumbersEl = document.getElementById('lineNumbers');
const saveIndicator = document.getElementById('saveIndicator');
const bgMonitorToggle = document.getElementById('bgMonitorToggle');
const statusBadge = document.getElementById('statusBadge');
const statusPulse = document.getElementById('statusPulse');
const statusText = document.getElementById('statusText');

// Tabs selectors
const tabDashboardBtn = document.getElementById('tabDashboardBtn');
const tabIssuesBtn = document.getElementById('tabIssuesBtn');
const tabAstBtn = document.getElementById('tabAstBtn');
const tabCompilerBtn = document.getElementById('tabCompilerBtn');

const tabDashboard = document.getElementById('tabDashboard');
const tabIssues = document.getElementById('tabIssues');
const tabAst = document.getElementById('tabAst');
const tabCompiler = document.getElementById('tabCompiler');

// Compiler selectors
const triggerBuildBtn = document.getElementById('triggerBuildBtn');
const compilerLogs = document.getElementById('compilerLogs');
const compiledSandboxFrame = document.getElementById('compiledSandboxFrame');

// Metrics targets
const maintainabilityScore = document.getElementById('maintainabilityScore');
const maintainabilityBar = document.getElementById('maintainabilityBar');
const securityScore = document.getElementById('securityScore');
const securityBar = document.getElementById('securityBar');
const complexityMetric = document.getElementById('complexityMetric');
const deadCodeMetric = document.getElementById('deadCodeMetric');

const metricLines = document.getElementById('metricLines');
const metricChars = document.getElementById('metricChars');
const metricTokens = document.getElementById('metricTokens');
const metricSize = document.getElementById('metricSize');

const diagnosticLogs = document.getElementById('diagnosticLogs');
const astTree = document.getElementById('astTree');

// Setup Action Controls
const formatBtn = document.getElementById('formatBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const minifyBtn = document.getElementById('minifyBtn');
const addFileBtn = document.getElementById('addFileBtn');

function init() {
  renderFileList();
  loadFile(0);
  setupListeners();
  lucide.createIcons();
  startBackgroundDaemon();
}

function loadFile(index) {
  if (virtualFiles.length === 0) {
    // Fail-safe default if empty
    virtualFiles = [...defaultFiles];
  }
  if (index < 0 || index >= virtualFiles.length) {
    index = 0;
  }
  
  currentFileIndex = index;
  const file = virtualFiles[index];
  
  editorEl.value = file.content;
  currentFileNameEl.textContent = file.name;
  fileLanguageEl.textContent = file.language;

  // Render selection indicators
  document.querySelectorAll('.file-item-btn').forEach((btn, idx) => {
    if (idx === index) {
      btn.classList.add('bg-[#313244]', 'text-white');
      btn.classList.remove('text-[#a6adc8]');
    } else {
      btn.classList.remove('bg-[#313244]', 'text-white');
      btn.classList.add('text-[#a6adc8]');
    }
  });

  updateLineNumbers();
  runAnalysisSuite();
}

function renderFileList() {
  fileListEl.innerHTML = '';
  virtualFiles.forEach((file, idx) => {
    const itemContainer = document.createElement('div');
    itemContainer.className = "group flex items-center justify-between w-full px-2 py-1.5 rounded-md transition-all hover:bg-[#1e1e2e]/60";
    
    let icon = 'file-text';
    if (file.language === 'html') icon = 'file-code';
    if (file.language === 'javascript') icon = 'file-json';
    if (file.language === 'css') icon = 'file-type-2';

    const isActive = idx === currentFileIndex;

    itemContainer.innerHTML = 
      <button class="file-item-btn flex-1 flex items-center gap-2 text-left text-xs truncate py-1 px-1 rounded transition-all ${isActive ? 'text-white font-medium bg-[#313244]' : 'text-[#a6adc8] hover:text-white'}" data-index="${idx}">
        <i data-lucide="${icon}" class="w-4 h-4 shrink-0 text-[#89b4fa]"></i>
        <span class="truncate">${file.name}</span>
      </button>
      
      <!-- Management Controls shown on parent group hover -->
      <div class="hidden group-hover:flex items-center gap-1.5 shrink-0 ml-2 px-1">
        <button class="rename-file-btn text-[#a6adc8] hover:text-[#f9e2af] transition-colors p-0.5" title="Rename File" data-index="${idx}">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
        </button>
        <button class="delete-file-btn text-[#a6adc8] hover:text-[#f38ba8] transition-colors p-0.5" title="Delete File" data-index="${idx}">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    ;

    // Bind item click
    itemContainer.querySelector('.file-item-btn').addEventListener('click', () => loadFile(idx));
    
    // Bind rename click
    itemContainer.querySelector('.rename-file-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      renameFile(idx);
    });

    // Bind delete click
    itemContainer.querySelector('.delete-file-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteFile(idx);
    });

    fileListEl.appendChild(itemContainer);
  });
  lucide.createIcons();
}

function renameFile(idx) {
  const file = virtualFiles[idx];
  const newName = prompt(Rename ${file.name} to:, file.name);
  if (!newName || newName.trim() === "" || newName === file.name) return;

  // Collision detection
  const isDuplicate = virtualFiles.some((f, i) => i !== idx && f.name.toLowerCase() === newName.toLowerCase());
  if (isDuplicate) {
    alert("Error: A file with that name already exists.");
    return;
  }

  const ext = newName.split('.').pop().toLowerCase();
  let language = 'javascript';
  if (ext === 'html' || ext === 'htm') language = 'html';
  if (ext === 'css') language = 'css';

  file.name = newName;
  file.language = language;

  saveToLocalStorage();
  renderFileList();
  loadFile(currentFileIndex);
}

function deleteFile(idx) {
  if (virtualFiles.length <= 1) {
    alert("Workspace Constraint: You must keep at least one sandbox file.");
    return;
  }

  const file = virtualFiles[idx];
  if (!confirm(Are you sure you want to delete "${file.name}"?)) return;

  virtualFiles.splice(idx, 1);
  
  // Adjust current index bounds safely
  if (currentFileIndex >= virtualFiles.length) {
    currentFileIndex = virtualFiles.length - 1;
  } else if (idx === currentFileIndex) {
    // If we deleted the active file, refocus on another
    currentFileIndex = Math.max(0, currentFileIndex - 1);
  }

  saveToLocalStorage();
  renderFileList();
  loadFile(currentFileIndex);
}

function saveToLocalStorage() {
  localStorage.setItem('code_inspector_files_v3', JSON.stringify(virtualFiles));
  saveIndicator.classList.remove('hidden');
  saveIndicator.classList.add('flex');
  setTimeout(() => {
    saveIndicator.classList.remove('flex');
    saveIndicator.classList.add('hidden');
  }, 1000);
}

// Client-Side compiler/bundler function
function compileWorkspace() {
  compilerLogs.textContent = "Booting compiler daemon...";
  
  // 1. Extract files
  const htmlFile = virtualFiles.find(f => f.name.endsWith('.html'));
  const cssFile = virtualFiles.find(f => f.name.endsWith('.css'));
  const jsFile = virtualFiles.find(f => f.name.endsWith('.js'));

  if (!htmlFile) {
    compilerLogs.innerHTML = <span class="text-red-400">ERROR: Compilation failed. No "index.html" file found in workspace root.</span>;
    return;
  }

  compilerLogs.innerHTML = <div>Bundling file tree system...</div>;

  setTimeout(() => {
    try {
      let rawHtml = htmlFile.content;
      const cssContent = cssFile ? cssFile.content : '';
      const jsContent = jsFile ? jsFile.content : '';

      // 2. Compile/Inject Stylesheet block before closing head tag
      const compiledStyles = <style>\n${cssContent}\n</style>;
      if (rawHtml.includes('</head>')) {
        rawHtml = rawHtml.replace('</head>', ${compiledStyles}\n</head>);
      } else {
        rawHtml = compiledStyles + rawHtml;
      }

      // 3. Compile/Inject Javascript block before closing body tag
      const compiledScript = <script>\n${jsContent}\n<\/script>;
      if (rawHtml.includes('</body>')) {
        rawHtml = rawHtml.replace('</body>', ${compiledScript}\n</body>);
      } else {
        rawHtml = rawHtml + compiledScript;
      }

      // 4. Feed compiled source directly into sandboxed iframe using modern Blob mechanism
      const blob = new Blob([rawHtml], { type: 'text/html' });
      const compiledUrl = URL.createObjectURL(blob);
      compiledSandboxFrame.src = compiledUrl;

      compilerLogs.innerHTML = 
        <div class="text-green-400">⚡ Build Compiled Successfully!</div>
        <div class="text-[#89b4fa]">> Bundled HTML (${htmlFile.content.length} Bytes)</div>
        <div class="text-[#89b4fa]">> Injected CSS Style Node (${cssContent.length} Bytes)</div>
        <div class="text-[#89b4fa]">> Bundled Sandbox Javascript Engine (${jsContent.length} Bytes)</div>
      ;
    } catch (err) {
      compilerLogs.innerHTML = <span class="text-red-400">COMPILER EXCEPTION: ${err.message}</span>;
    }
  }, 400);
}

function setupListeners() {
  // Editor key tracking to schedule daemon audits
  editorEl.addEventListener('input', () => {
    virtualFiles[currentFileIndex].content = editorEl.value;
    updateLineNumbers();
    triggerBackgroundDaemonPulse();
    saveToLocalStorage();
  });

  editorEl.addEventListener('scroll', () => {
    lineNumbersEl.scrollTop = editorEl.scrollTop;
  });

  // Tab key intercept
  editorEl.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editorEl.selectionStart;
      const end = editorEl.selectionEnd;
      const value = editorEl.value;

      editorEl.value = value.substring(0, start) + "  " + value.substring(end);
      editorEl.selectionStart = editorEl.selectionEnd = start + 2;

      virtualFiles[currentFileIndex].content = editorEl.value;
      updateLineNumbers();
      triggerBackgroundDaemonPulse();
      saveToLocalStorage();
    }
  });

  // Shortcuts: Ctrl+S trigger
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      runAnalysisSuite();
      compileWorkspace();
    }
  });

  // Sidebar Tab Switches
  tabDashboardBtn.addEventListener('click', () => switchTab('dashboard'));
  tabIssuesBtn.addEventListener('click', () => switchTab('issues'));
  tabAstBtn.addEventListener('click', () => switchTab('ast'));
  tabCompilerBtn.addEventListener('click', () => {
    switchTab('compiler');
    compileWorkspace();
  });

  // Run controls
  analyzeBtn.addEventListener('click', runAnalysisSuite);
  formatBtn.addEventListener('click', formatCurrentBuffer);
  minifyBtn.addEventListener('click', minifyCurrentBuffer);
  triggerBuildBtn.addEventListener('click', compileWorkspace);

  // Upgraded Dynamic Add File with customized modern template boilerplates
  addFileBtn.addEventListener('click', () => {
    const filename = prompt("Enter new filename:", "utils.js");
    if (filename) {
      const cleanName = filename.trim();
      if (cleanName === "") return;

      const isDuplicate = virtualFiles.some(f => f.name.toLowerCase() === cleanName.toLowerCase());
      if (isDuplicate) {
        alert("A file with that name already exists in the workspace.");
        return;
      }

      const ext = cleanName.split('.').pop().toLowerCase();
      let language = 'javascript';
      let template = '';

      if (ext === 'html' || ext === 'htm') {
        language = 'html';
        template = <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Document Sandbox</title>
</head>
<body>
  <div id="app">
    <h1>Welcome to ${cleanName}</h1>
  </div>
</body>
</html>;
      } else if (ext === 'css') {
        language = 'css';
        template = /* ${cleanName} Architecture Baseline */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  max-width: 1200px;
  margin: 0 auto;
};
      } else {
        language = 'javascript';
        template = // Workspace script: ${cleanName}
export function initialize() {
  const isHealthy = true;
  console.log("Initialize system diagnostics...");
  return isHealthy;
};
      }

      virtualFiles.push({
        id: file-${Date.now()},
        name: cleanName,
        language: language,
        content: template
      });

      saveToLocalStorage();
      renderFileList();
      loadFile(virtualFiles.length - 1);
    }
  });
}

function switchTab(target) {
  const tabs = [
    { name: 'dashboard', btn: tabDashboardBtn, container: tabDashboard },
    { name: 'issues', btn: tabIssuesBtn, container: tabIssues },
    { name: 'ast', btn: tabAstBtn, container: tabAst },
    { name: 'compiler', btn: tabCompilerBtn, container: tabCompiler }
  ];

  tabs.forEach(tab => {
    if (tab.name === target) {
      tab.btn.classList.add('border-[#cba6f7]', 'text-white');
      tab.btn.classList.remove('border-transparent', 'text-[#a6adc8]');
      tab.container.classList.remove('hidden');
    } else {
      tab.btn.classList.remove('border-[#cba6f7]', 'text-white');
      tab.btn.classList.add('border-transparent', 'text-[#a6adc8]');
      tab.container.classList.add('hidden');
    }
  });
}

function updateLineNumbers() {
  const count = editorEl.value.split('\n').length;
  let lineStr = '';
  for (let i = 1; i <= count; i++) {
    lineStr += ${i}<br>;
  }
  lineNumbersEl.innerHTML = lineStr;
}

// Background Monitor Scheduler
function startBackgroundDaemon() {
  if (daemonTimer) clearInterval(daemonTimer);
  
  daemonTimer = setInterval(() => {
    if (bgMonitorToggle.checked) {
      setDaemonStatus("scanning", "Daemon: Auto-Checking");
      setTimeout(() => {
        runAnalysisSuite(false); // Silent run in background
        setDaemonStatus("idle", "Daemon: Watching");
      }, 300);
    } else {
      setDaemonStatus("disabled", "Daemon: Suspended");
    }
  }, 4000);
}

function triggerBackgroundDaemonPulse() {
  if (!bgMonitorToggle.checked) return;
  setDaemonStatus("typing", "Daemon: Catching changes...");
  
  clearTimeout(typingDebounceTimeout);
  typingDebounceTimeout = setTimeout(() => {
    runAnalysisSuite(false);
    setDaemonStatus("idle", "Daemon: Watching");
  }, 1200);
}

function setDaemonStatus(mode, text) {
  statusText.textContent = text;
  statusPulse.className = "w-2 h-2 rounded-full";
  
  if (mode === 'scanning') {
    statusPulse.classList.add('bg-[#f9e2af]', 'animate-ping');
  } else if (mode === 'typing') {
    statusPulse.classList.add('bg-[#89b4fa]');
  } else if (mode === 'disabled') {
    statusPulse.classList.add('bg-[#585b70]');
  } else {
    statusPulse.classList.add('bg-[#a6e3a1]');
  }
}

// Core Complex Analysis Suite
function runAnalysisSuite(flashUI = true) {
  if (virtualFiles.length === 0) return;
  const code = editorEl.value;
  const lang = virtualFiles[currentFileIndex].language;

  // Calculate Metrics
  const lineCount = code.split('\n').length;
  const charCount = code.length;
  const estTokens = Math.ceil(charCount / 4.2);
  const sizeBytes = new Blob([code]).size;

  metricLines.textContent = lineCount;
  metricChars.textContent = charCount;
  metricTokens.textContent = estTokens;
  metricSize.textContent = sizeBytes < 1024 ? ${sizeBytes} B : ${(sizeBytes/1024).toFixed(1)} KB;

  // Advanced Linter Metrics Engines
  const issues = [];
  const astNodes = [];

  let complexity = 1;
  let deadVariables = [];

  if (lang === 'javascript') {
    // 1. Cyclomatic Complexity approximation: counts branching operators
    const branches = code.match(/(if\s*\(|for\s*\(|while\s*\(|catch\s*\(|(?:\&\&|\|\|)|\bcase\s+)/g);
    complexity = branches ? branches.length + 1 : 1;

    // 2. Dead Code Detection: search declared vars that only appear once in whole document
    const variableDeclarations = [...code.matchAll(/(?:const|let|var)\s+([a-zA-Z0-9_$]+)\s*=/g)];
    variableDeclarations.forEach(match => {
      const varName = match[1];
      const escapedVarName = varName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const varRegex = new RegExp(\\b${escapedVarName}\\b, 'g');
      const occurrences = (code.match(varRegex) || []).length;
      if (occurrences === 1) {
        deadVariables.push({ name: varName, line: getLineFromIdx(code, match.index) });
      }
    });

    // 3. Security Auditing
    // Detecting hardcoded key lookalikes
    const secretRegex = /(?:api_key|token|secret|password|passwd|auth)\s*=\s*['"]([a-zA-Z0-9_\-]{8,})['"]/gi;
    let secMatch;
    while ((secMatch = secretRegex.exec(code)) !== null) {
      issues.push({
        severity: 'error',
        text: Security Vulnerability: Found hardcoded identifier key/credential trace near "${secMatch[1].substring(0,4)}***",
        category: 'security'
      });
    }

    // Detecting unsafe innerHTML usage
    if (code.includes('.innerHTML')) {
      issues.push({
        severity: 'warning',
        text: "Performance & Security: '.innerHTML' found. Prefer using 'textContent' or 'createElement' to mitigate basic DOM XSS pathways.",
        category: 'security'
      });
    }

    // Detecting raw eval statements
    if (code.match(/\beval\s*\(/)) {
      issues.push({
        severity: 'error',
        text: "Security Threat: Evaluator command execution using 'eval()' block discovered.",
        category: 'security'
      });
    }

    // Standard structural mappings for AST Tree
    const classRegex = /class\s+(\w+)/g;
    let cls;
    while ((cls = classRegex.exec(code)) !== null) {
      astNodes.push({ type: 'ClassNode', name: cls[1], line: getLineFromIdx(code, cls.index) });
    }

    const funcRegex = /function\s+(\w+)|(\w+)\s*=\s*\([^)]*\)\s*=>/g;
    let fn;
    while ((fn = funcRegex.exec(code)) !== null) {
      const name = fn[1] || fn[2];
      if (name) astNodes.push({ type: 'FunctionNode', name: name, line: getLineFromIdx(code, fn.index) });
    }

    variableDeclarations.forEach(match => {
      astNodes.push({ type: 'VariableScope', name: match[1], line: getLineFromIdx(code, match.index) });
    });

  } else if (lang === 'html') {
    // Audit Inline handlers for HTML
    const inlineOnRegex = /\bon[a-z]+\s*=\s*['"]/gi;
    if (inlineOnRegex.test(code)) {
      issues.push({
        severity: 'warning',
        text: "Security Policy: Found inline DOM handler attributes. Migrate attributes to external event listeners to obey Content Security Policies (CSP).",
        category: 'security'
      });
    }

    // Parsing document nodes
    const tagRegex = /<([a-zA-Z0-9\-]+)(?:\s+[^>]*)*>/g;
    let tags;
    while ((tags = tagRegex.exec(code)) !== null) {
      if (!['html', 'head', 'body', 'meta', 'link'].includes(tags[1])) {
        astNodes.push({ type: 'HtmlElement', name: <${tags[1]}>, line: getLineFromIdx(code, tags.index) });
      }
    }
  } else if (lang === 'css') {
    const cssRegex = /([.#\w\-\s,:+>*]+)\s*\{/g;
    let sel;
    while ((sel = cssRegex.exec(code)) !== null) {
      const name = sel[1].trim();
      if (name && !name.startsWith('@')) {
        astNodes.push({ type: 'StyleRule', name: name, line: getLineFromIdx(code, sel.index) });
      }
    }
  }

  // Register issues for dead code variables
  deadVariables.forEach(v => {
    issues.push({
      severity: 'warning',
      text: Static Linter: "${v.name}" is declared but never referenced or evaluated. Remove to maintain DRY compliance.,
      category: 'static'
    });
  });

  // Calculate Maintainability Index (Simulated custom Halstead metric)
  let maintainability = Math.max(20, Math.round(100 - (complexity * 4.5) - (deadVariables.length * 5) - (issues.length * 10)));
  if (lineCount > 150) maintainability -= 10;
  maintainability = Math.max(10, Math.min(100, maintainability));

  // Visual Health Dashboard UI Binding
  maintainabilityScore.textContent = ${maintainability}/100;
  maintainabilityBar.style.width = ${maintainability}%;
  if (maintainability > 75) {
    maintainabilityScore.className = "font-bold text-[#a6e3a1]";
    maintainabilityBar.className = "bg-[#a6e3a1] h-full transition-all duration-500";
  } else if (maintainability > 45) {
    maintainabilityScore.className = "font-bold text-[#f9e2af]";
    maintainabilityBar.className = "bg-[#f9e2af] h-full transition-all duration-500";
  } else {
    maintainabilityScore.className = "font-bold text-[#f38ba8]";
    maintainabilityBar.className = "bg-[#f38ba8] h-full transition-all duration-500";
  }

  // Security Assessment Dashboard
  const securityIssuesCount = issues.filter(i => i.category === 'security').length;
  let securityHealth = 100 - (securityIssuesCount * 35);
  securityHealth = Math.max(10, Math.min(100, securityHealth));
  
  securityBar.style.width = ${securityHealth}%;
  if (securityHealth > 80) {
    securityScore.textContent = "Excellent Status";
    securityScore.className = "font-bold text-[#a6e3a1]";
    securityBar.className = "bg-[#a6e3a1] h-full transition-all duration-500";
  } else if (securityHealth > 45) {
    securityScore.textContent = "Vulnerable";
    securityScore.className = "font-bold text-[#f9e2af]";
    securityBar.className = "bg-[#f9e2af] h-full transition-all duration-500";
  } else {
    securityScore.textContent = "Critical Risk";
    securityScore.className = "font-bold text-[#f38ba8]";
    securityBar.className = "bg-[#f38ba8] h-full transition-all duration-500";
  }

  complexityMetric.textContent = complexity;
  deadCodeMetric.textContent = deadVariables.length;

  // Render diagnostics view
  renderDiagnostics(issues);

  // Render AST structural view
  renderAst(astNodes);

  // Pulse effect if forced manually
  if (flashUI && analyzeBtn) {
    analyzeBtn.classList.add('ring-2', 'ring-[#89b4fa]/50');
    setTimeout(() => analyzeBtn.classList.remove('ring-2'), 400);
  }
}

function getLineFromIdx(code, index) {
  return code.substring(0, index).split('\n').length;
}

function renderDiagnostics(issues) {
  diagnosticLogs.innerHTML = '';
  if (issues.length === 0) {
    diagnosticLogs.innerHTML = 
      <div class="text-[#a6e3a1] flex gap-2 bg-[#a6e3a1]/10 p-3 rounded border border-[#a6e3a1]/30 text-xs">
        <i data-lucide="check-circle" class="w-4 h-4 shrink-0"></i>
        <span>Workspace clean! Passed security audits, structure check, and dead-code static requirements.</span>
      </div>
    ;
  } else {
    issues.forEach(issue => {
      const isErr = issue.severity === 'error';
      const wrapper = document.createElement('div');
      wrapper.className = flex gap-2.5 p-2.5 rounded border text-xs leading-relaxed ${isErr ? 'bg-[#f38ba8]/10 border-[#f38ba8]/30 text-[#f38ba8]' : 'bg-[#f9e2af]/10 border-[#f9e2af]/30 text-[#f9e2af]'};
      
      wrapper.innerHTML = 
        <i data-lucide="${isErr ? 'shield-alert' : 'alert-triangle'}" class="w-4 h-4 shrink-0 mt-0.5"></i>
        <div class="space-y-1">
          <span class="font-bold block uppercase text-[9px] tracking-wide">${issue.category || 'Warning'}</span>
          <span>${issue.text}</span>
        </div>
      ;
      diagnosticLogs.appendChild(wrapper);
    });
  }
  lucide.createIcons();
}

function renderAst(nodes) {
  astTree.innerHTML = '';
  if (nodes.length === 0) {
    astTree.innerHTML = <div class="text-[#585b70] italic p-1">No structures or definitions found in current document scope.</div>;
    return;
  }

  nodes.forEach(node => {
    const element = document.createElement('div');
    element.className = "flex items-center justify-between bg-[#1e1e2e] p-2 rounded border border-[#313244] hover:border-[#cba6f7] transition-all cursor-pointer group";
    
    let icon = 'hash';
    let color = 'text-[#cba6f7]';
    if (node.type === 'ClassNode') { icon = 'package'; color = 'text-[#f9e2af]'; }
    if (node.type === 'FunctionNode') { icon = 'terminal'; color = 'text-[#89b4fa]'; }
    if (node.type === 'VariableScope') { icon = 'variable'; color = 'text-[#b4befe]'; }
    if (node.type === 'HtmlElement') { icon = 'globe'; color = 'text-[#a6e3a1]'; }
    if (node.type === 'StyleRule') { icon = 'brush'; color = 'text-[#f38ba8]'; }

    element.innerHTML = 
      <div class="flex items-center gap-2 min-w-0">
        <i data-lucide="${icon}" class="w-3.5 h-3.5 ${color} shrink-0"></i>
        <div class="truncate">
          <span class="text-[9px] text-[#585b70] block uppercase leading-none font-semibold">${node.type}</span>
          <span class="text-white text-xs block mt-0.5 font-mono truncate">${node.name}</span>
        </div>
      </div>
      <span class="text-[9px] bg-[#313244] text-[#a6adc8] px-1.5 py-0.5 rounded font-bold tracking-wider group-hover:bg-[#cba6f7] group-hover:text-[#11111b] transition-colors">Ln ${node.line}</span>
    ;

    element.addEventListener('click', () => jumpToSourceLine(node.line));
    astTree.appendChild(element);
  });
  lucide.createIcons();
}

function jumpToSourceLine(lineNum) {
  const lines = editorEl.value.split('\n');
  let cursorOffset = 0;
  for (let i = 0; i < lineNum - 1; i++) {
    cursorOffset += lines[i].length + 1;
  }
  editorEl.focus();
  editorEl.setSelectionRange(cursorOffset, cursorOffset + lines[lineNum - 1].length);
}

function formatCurrentBuffer() {
  const code = editorEl.value;
  const lang = virtualFiles[currentFileIndex].language;
  let formatted = code;

  if (lang === 'javascript') {
    formatted = code
      .replace(/;\s*$/gm, ';')
      .replace(/{\s*$/gm, ' {\n')
      .split('\n')
      .map(line => line.trim())
      .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
      .join('\n');
      
    let depth = 0;
    formatted = formatted.split('\n').map(line => {
      if (line.includes('}')) depth = Math.max(0, depth - 1);
      const lineOut = '  '.repeat(depth) + line;
      if (line.includes('{')) depth++;
      return lineOut;
    }).join('\n');
  } else {
    formatted = code.split('\n').map(line => line.trim()).join('\n');
  }

  editorEl.value = formatted;
  virtualFiles[currentFileIndex].content = formatted;
  updateLineNumbers();
  runAnalysisSuite();
  saveToLocalStorage();
}

// Cautious CSS and JS Minifier
function minifyCurrentBuffer() {
  const code = editorEl.value;
  const minified = code
    .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // strip comments
    .replace(/\s+/g, ' ')
    .replace(/\s*([{};,])\s*/g, '$1')
    .trim();

  editorEl.value = minified;
  virtualFiles[currentFileIndex].content = minified;
  updateLineNumbers();
  runAnalysisSuite();
  saveToLocalStorage();
}

window.addEventListener('DOMContentLoaded', init);
```
---