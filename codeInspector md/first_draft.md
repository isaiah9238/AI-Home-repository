### The Code Inspector
-by Gemini and the ghost writer

Rules:
1. Files must flow in order to render the code inspector. 
2. We must use common respect. 
3. There is no replace notebook. 
4. There is only app end if the file goes after the end file. 
5. The first file is the file that is used to start the app.
6. This is not a svg App, it will be a functional Code Inspector.

```Explorer:
Public
    -index.html
```
index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Code Inspector</title>
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
        <i data-lucide="binary" class="w-5 h-5"></i>
      </div>
      <div>
        <h1 class="text-sm font-bold tracking-wider text-white uppercase">The Code Inspector</h1>
        <p class="text-[10px] text-[#a6adc8]">Engineered by Gemini & The Ghost Writer</p>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 bg-[#1e1e2e] px-3 py-1.5 rounded-md border border-[#313244] text-xs">
        <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span class="text-[#a6adc8] font-medium">Inspector Engine: Active</span>
      </div>
    </div>
  </header>

  <!-- Workspace Grid -->
  <div class="flex flex-1 overflow-hidden">
    
    <!-- Left Sidebar: File Tree & Presets -->
    <aside class="w-64 bg-[#11111b] border-r border-[#313244] flex flex-col shrink-0">
      <div class="p-4 border-b border-[#313244] flex items-center justify-between">
        <span class="text-xs font-bold uppercase tracking-wider text-[#a6adc8] flex items-center gap-2">
          <i data-lucide="folder-tree" class="w-4 h-4 text-[#89b4fa]"></i> Explorer
        </span>
        <button id="addFileBtn" class="text-[#a6adc8] hover:text-white transition-colors" title="Create New virtual file">
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
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#f9e2af]"></i>
          <span>Inspector Protocol</span>
        </div>
        <p class="leading-relaxed">Files flow sequentially to verify build pipelines. Syntactical structures are audited in real-time below.</p>
      </div>
    </aside>

    <!-- Center Pane: Editor Workspace -->
    <main class="flex-1 flex flex-col bg-[#1e1e2e] relative">
      <!-- Editor Control Tab -->
      <div class="bg-[#11111b] border-b border-[#313244] px-4 py-2 flex items-center justify-between text-xs">
        <div class="flex items-center gap-2">
          <i data-lucide="file-code" class="w-4 h-4 text-[#cba6f7]"></i>
          <span id="currentFileName" class="font-medium text-white">index.html</span>
          <span class="text-[#585b70]">|</span>
          <span id="fileLanguage" class="text-[#a6adc8] bg-[#313244] px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">html</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="formatBtn" class="bg-[#313244] hover:bg-[#45475a] text-white px-3 py-1 rounded flex items-center gap-1.5 transition-colors">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#f9e2af]"></i> Format
          </button>
          <button id="analyzeBtn" class="bg-[#89b4fa] hover:bg-[#b4befe] text-[#11111b] font-semibold px-3 py-1 rounded flex items-center gap-1.5 transition-colors">
            <i data-lucide="play" class="w-3.5 h-3.5"></i> Run Inspector
          </button>
        </div>
      </div>

      <!-- Main Textarea with simulated line numbers -->
      <div class="flex-1 flex overflow-hidden">
        <!-- Line Numbers gutter -->
        <div id="lineNumbers" class="w-12 bg-[#11111b] text-[#585b70] text-right pr-3 pt-4 select-none code-font text-xs leading-6">
          1
        </div>
        <!-- Actual Editor -->
        <textarea id="editor" class="flex-1 bg-transparent text-[#cdd6f4] p-4 focus:outline-none resize-none code-font text-xs leading-6 overflow-y-auto whitespace-pre block" spellcheck="false"></textarea>
      </div>
    </main>

    <!-- Right Sidebar: Analysis & AST Inspector Tree -->
    <section class="w-80 bg-[#11111b] border-l border-[#313244] flex flex-col shrink-0">
      <!-- Section Tabs -->
      <div class="flex border-b border-[#313244] text-xs">
        <button id="tabAstBtn" class="flex-1 py-3 text-center border-b-2 border-[#cba6f7] font-semibold text-white">
          Inspector AST
        </button>
        <button id="tabMetricsBtn" class="flex-1 py-3 text-center border-b-2 border-transparent text-[#a6adc8] hover:text-white font-semibold">
          Metrics & Linters
        </button>
      </div>

      <!-- Dynamic Content Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        
        <!-- Tab 1: AST / Structural Tree -->
        <div id="tabAst" class="space-y-4">
          <div class="bg-[#181825] border border-[#313244] rounded-lg p-3">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4 text-[#a6e3a1]"></i> Code Topology Tree
            </h3>
            <p class="text-[11px] text-[#a6adc8] mb-3">Live lexical structural nodes discovered in file.</p>
            
            <div id="astTree" class="space-y-2 text-xs code-font">
              <!-- AST items dynamic -->
              <div class="text-[#585b70] italic">No code audited yet. Click "Run Inspector".</div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Code Metrics -->
        <div id="tabMetrics" class="space-y-4 hidden">
          <!-- Live Metrics grid -->
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-[#181825] p-3 rounded-lg border border-[#313244]">
              <div class="text-[10px] uppercase text-[#a6adc8]">Total Lines</div>
              <div id="metricLines" class="text-xl font-bold text-white mt-1">0</div>
            </div>
            <div class="bg-[#181825] p-3 rounded-lg border border-[#313244]">
              <div class="text-[10px] uppercase text-[#a6adc8]">Total Characters</div>
              <div id="metricChars" class="text-xl font-bold text-white mt-1">0</div>
            </div>
            <div class="bg-[#181825] p-3 rounded-lg border border-[#313244]">
              <div class="text-[10px] uppercase text-[#a6adc8]">Est. Tokens</div>
              <div id="metricTokens" class="text-xl font-bold text-white mt-1">0</div>
            </div>
            <div class="bg-[#181825] p-3 rounded-lg border border-[#313244]">
              <div class="text-[10px] uppercase text-[#a6adc8]">File Size</div>
              <div id="metricSize" class="text-xl font-bold text-white mt-1">0 B</div>
            </div>
          </div>

          <!-- Linter Diagnostics -->
          <div class="bg-[#181825] border border-[#313244] rounded-lg p-3">
            <h3 class="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i data-lucide="shield-alert" class="w-4 h-4 text-[#f38ba8]"></i> Diagnostic Logs
            </h3>
            <div id="linterLogs" class="space-y-2 text-[11px]">
              <div class="text-green-400 flex items-center gap-2 bg-[#1e1e2e] p-2 rounded border border-green-500/20">
                <i data-lucide="check-circle" class="w-3.5 h-3.5 shrink-0"></i>
                <span>All clear! No syntax errors analyzed.</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Action Panel Footer -->
      <div class="p-4 bg-[#11111b] border-t border-[#313244] space-y-2 shrink-0">
        <button id="minifyBtn" class="w-full bg-[#313244] hover:bg-[#45475a] text-white py-2 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all">
          <i data-lucide="minimize-2" class="w-4 h-4"></i> Minify Code Buffer
        </button>
      </div>
    </section>

  </div>

  <script src="app.js"></script>
</body>
</html>
```
styles. ccs
```CCS
body {
  font-family: 'Inter', sans-serif;
}
.code-font {
  font-family: 'Fira Code', monospace;
}
/* Custom Scrollbar */
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
```
App.js
```js
// System virtual file setup
const virtualFiles = [
  {
    id: "index-html",
    name: "index.html",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Architect Lounge</title>
</head>
<body>
  <header class="main-header">
    <h1>Welcome to the Code Node</h1>
  </header>
  <main>
    <p>Constructing elegant systems line by line.</p>
  </main>
  <script src="app.js"><\/script>
</body>
</html>`
  },
  {
    id: "app-js",
    name: "app.js",
    language: "javascript",
    content: `// The Code Inspector Engine Initialize
const systemVersion = "v2.0.4";
const inspectorProtocol = true;

function runAudit(file, size) {
  console.log("Analyzing file target: " + file);
  let issuesFound = 0;
  
  if (size > 1000) {
    issuesFound += 1;
    displayWarning("Large payload buffer identified.");
  }
  
  return {
    success: true,
    issues: issuesFound
  };
}

class SystemInspector {
  constructor() {
    this.status = "ONLINE";
  }
  
  verify() {
    return this.status === "ONLINE";
  }
}`
  },
  {
    id: "styles-css",
    name: "styles.css",
    language: "css",
    content: `/* Custom Variables and Design Archetype */
:root {
  --primary: #cba6f7;
  --bg-dark: #11111b;
  --text-light: #cdd6f4;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-light);
  font-family: 'Fira Code', monospace;
  margin: 0;
  padding: 0;
}`
  }
];

let currentFileIndex = 0;

// Elements
const fileListEl = document.getElementById('fileList');
const currentFileNameEl = document.getElementById('currentFileName');
const fileLanguageEl = document.getElementById('fileLanguage');
const editorEl = document.getElementById('editor');
const lineNumbersEl = document.getElementById('lineNumbers');

// Sidebar Tabs
const tabAstBtn = document.getElementById('tabAstBtn');
const tabMetricsBtn = document.getElementById('tabMetricsBtn');
const tabAst = document.getElementById('tabAst');
const tabMetrics = document.getElementById('tabMetrics');

// Controls
const formatBtn = document.getElementById('formatBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const minifyBtn = document.getElementById('minifyBtn');
const addFileBtn = document.getElementById('addFileBtn');

// Metrics elements
const metricLines = document.getElementById('metricLines');
const metricChars = document.getElementById('metricChars');
const metricTokens = document.getElementById('metricTokens');
const metricSize = document.getElementById('metricSize');
const linterLogs = document.getElementById('linterLogs');
const astTree = document.getElementById('astTree');

// Initialize UI
function init() {
  renderFileList();
  loadFile(0);
  lucide.createIcons();
  setupEventListeners();
}

// Load selected file
function loadFile(index) {
  currentFileIndex = index;
  const file = virtualFiles[index];
  editorEl.value = file.content;
  currentFileNameEl.textContent = file.name;
  fileLanguageEl.textContent = file.language;
  
  // Highlight active file in explorer sidebar
  document.querySelectorAll('.file-item').forEach((item, idx) => {
    if (idx === index) {
      item.classList.add('bg-[#313244]', 'text-white');
      item.classList.remove('text-[#a6adc8]');
    } else {
      item.classList.remove('bg-[#313244]', 'text-white');
      item.classList.add('text-[#a6adc8]');
    }
  });

  updateLineNumbers();
  runInspection();
}

// Render Explorer sidebar lists
function renderFileList() {
  fileListEl.innerHTML = '';
  virtualFiles.forEach((file, idx) => {
    const item = document.createElement('button');
    item.className = `file-item w-full flex items-center justify-between px-3 py-2 text-xs rounded-md transition-all hover:bg-[#313244] hover:text-white text-left \${idx === currentFileIndex ? 'bg-[#313244] text-white' : 'text-[#a6adc8]'}`;
    
    // Choose file icon based on type
    let icon = 'file-text';
    if (file.language === 'html') icon = 'file-code-2';
    if (file.language === 'javascript') icon = 'file-json-2';
    if (file.language === 'css') icon = 'file-type-2';

    item.innerHTML = `
      <div class="flex items-center gap-2">
        <i data-lucide="\${icon}" class="w-4 h-4 shrink-0"></i>
        <span class="truncate">\${file.name}</span>
      </div>
      <span class="text-[10px] text-[#585b70] tracking-wider uppercase font-semibold">\${file.language}</span>
    `;
    
    item.addEventListener('click', () => loadFile(idx));
    fileListEl.appendChild(item);
  });
  lucide.createIcons();
}

// Setup active listeners
function setupEventListeners() {
  // Monitor text changes to update line numbers
  editorEl.addEventListener('input', () => {
    virtualFiles[currentFileIndex].content = editorEl.value;
    updateLineNumbers();
    autoCalculateMetrics();
  });

  editorEl.addEventListener('scroll', () => {
    lineNumbersEl.scrollTop = editorEl.scrollTop;
  });

  // Tab switching
  tabAstBtn.addEventListener('click', () => {
    tabAstBtn.classList.add('border-[#cba6f7]', 'text-white');
    tabAstBtn.classList.remove('border-transparent', 'text-[#a6adc8]');
    tabMetricsBtn.classList.remove('border-[#cba6f7]', 'text-white');
    tabMetricsBtn.classList.add('border-transparent', 'text-[#a6adc8]');
    tabAst.classList.remove('hidden');
    tabMetrics.classList.add('hidden');
  });

  tabMetricsBtn.addEventListener('click', () => {
    tabMetricsBtn.classList.add('border-[#cba6f7]', 'text-white');
    tabMetricsBtn.classList.remove('border-transparent', 'text-[#a6adc8]');
    tabAstBtn.classList.remove('border-[#cba6f7]', 'text-white');
    tabAstBtn.classList.add('border-transparent', 'text-[#a6adc8]');
    tabMetrics.classList.remove('hidden');
    tabAst.classList.add('hidden');
  });

  // Actions triggers
  analyzeBtn.addEventListener('click', () => {
    runInspection();
    // Visual indicator
    analyzeBtn.classList.add('ring-2', 'ring-[#89b4fa]/50');
    setTimeout(() => analyzeBtn.classList.remove('ring-2'), 400);
  });

  formatBtn.addEventListener('click', () => {
    formatCurrentCode();
  });

  minifyBtn.addEventListener('click', () => {
    minifyCurrentCode();
  });

  // Add file dynamically
  addFileBtn.addEventListener('click', () => {
    const name = prompt("Enter new filename (with extension):", "utils.js");
    if (name) {
      const extension = name.split('.').pop();
      let lang = 'javascript';
      if (extension === 'html') lang = 'html';
      if (extension === 'css') lang = 'css';

      virtualFiles.push({
        id: `file-\${Date.now()}`,
        name: name,
        language: lang,
        content: `// Virtual sandbox created.\\n// Inspector target ready.\\n\\nfunction init\${name.split('.')[0]}() {\\n  return "online";\\n}`
      });
      renderFileList();
      loadFile(virtualFiles.length - 1);
    }
  });
}

// Dynamic line numbers rendering
function updateLineNumbers() {
  const lineCount = editorEl.value.split('\n').length;
  let numbersHtml = '';
  for (let i = 1; i <= lineCount; i++) {
    numbersHtml += `\${i}<br>`;
  }
  lineNumbersEl.innerHTML = numbersHtml;
}

// Live fast metric updates
function autoCalculateMetrics() {
  const code = editorEl.value;
  const lines = code.split('\n').length;
  const chars = code.length;
  const approxTokens = Math.ceil(chars / 4.1); // approximation rule of thumb
  const sizeBytes = new Blob([code]).size;

  metricLines.textContent = lines;
  metricChars.textContent = chars;
  metricTokens.textContent = approxTokens;
  metricSize.textContent = sizeBytes < 1024 ? `\${sizeBytes} B` : `\${(sizeBytes/1024).toFixed(1)} KB`;
}

// Code Inspector & Analysis Engine (RegEx-based Parser/Syntactic Auditor)
function runInspection() {
  autoCalculateMetrics();
  const code = editorEl.value;
  const lang = virtualFiles[currentFileIndex].language;
  
  // Reset diagnostic logs & AST
  linterLogs.innerHTML = '';
  astTree.innerHTML = '';

  let nodes = [];
  let issues = [];

  if (lang === 'javascript') {
    // Find Classes
    const classRegex = /class\\s+(\\w+)/g;
    let match;
    while ((match = classRegex.exec(code)) !== null) {
      nodes.push({ type: 'ClassNode', name: match[1], line: findLineNum(code, match.index) });
    }

    // Find Functions
    const funcRegex = /function\\s+(\\w+)|(\\w+)\\s*=\\s*\\([^)]*\\)\\s*=>/g;
    while ((match = funcRegex.exec(code)) !== null) {
      const fName = match[1] || match[2];
      if (fName) nodes.push({ type: 'FunctionNode', name: fName, line: findLineNum(code, match.index) });
    }

    // Find Variables (const/let)
    const varRegex = /(const|let|var)\\s+(\\w+)/g;
    while ((match = varRegex.exec(code)) !== null) {
      nodes.push({ type: 'VariableNode', name: `\${match[2]} (\${match[1]})`, line: findLineNum(code, match.index) });
    }

    // Linter rules: Check matching brackets
    const curlyOpen = (code.match(/\\{/g) || []).length;
    const curlyClose = (code.match(/\\}/g) || []).length;
    if (curlyOpen !== curlyClose) {
      issues.push({ severity: 'error', text: `Braces mismatch! Open: \${curlyOpen}, Closed: \${curlyClose}` });
    }

    // Linter rules: Check console.log traces
    if (code.includes('console.log')) {
      issues.push({ severity: 'warning', text: 'Detected production-grade log statement ("console.log").' });
    }

  } else if (lang === 'html') {
    // Find Tags
    const tagRegex = /<([a-zA-Z0-9\\-]+)(?:\\s+[^>]*)*>/g;
    let match;
    while ((match = tagRegex.exec(code)) !== null) {
      if (!['html', 'head', 'body', 'meta', 'link'].includes(match[1])) {
        nodes.push({ type: 'HtmlElement', name: `<\${match[1]}>`, line: findLineNum(code, match.index) });
      }
    }

    // Check head title
    if (!code.includes('<title>')) {
      issues.push({ severity: 'warning', text: 'Missing <title> parameter inside the document head node.' });
    }
  } else if (lang === 'css') {
    // Find selectors
    const cssRegex = /([.#\\w\\-\\s,:+>*]+)\\s*\\{/g;
    let match;
    while ((match = cssRegex.exec(code)) !== null) {
      const name = match[1].trim();
      if (name && !name.startsWith('@')) {
        nodes.push({ type: 'StyleRule', name: name, line: findLineNum(code, match.index) });
      }
    }
  }

  // Render AST Tree Node Items
  if (nodes.length === 0) {
    astTree.innerHTML = `<div class="text-[#585b70] italic">No functional elements/variables parsed.</div>`;
  } else {
    nodes.forEach(node => {
      const div = document.createElement('div');
      div.className = "flex items-center gap-2 bg-[#1e1e2e] p-2 rounded border border-[#313244] hover:border-[#cba6f7] transition-colors cursor-pointer group";
      
      let icon = 'hash';
      let color = 'text-[#cba6f7]';
      if (node.type === 'ClassNode') { icon = 'box'; color = 'text-[#f9e2af]'; }
      if (node.type === 'FunctionNode') { icon = 'activity'; color = 'text-[#89b4fa]'; }
      if (node.type === 'HtmlElement') { icon = 'code-2'; color = 'text-[#a6e3a1]'; }
      if (node.type === 'StyleRule') { icon = 'palette'; color = 'text-[#f38ba8]'; }

      div.innerHTML = `
        <i data-lucide="\${icon}" class="w-3.5 h-3.5 \${color} shrink-0"></i>
        <div class="flex-1 min-w-0">
          <span class="text-[10px] text-[#585b70] block uppercase leading-none font-bold">\${node.type}</span>
          <span class="text-white truncate block mt-0.5">\${node.name}</span>
        </div>
        <span class="text-[9px] bg-[#313244] text-[#a6adc8] px-1.5 py-0.5 rounded group-hover:bg-[#cba6f7] group-hover:text-[#11111b] transition-all">Ln \${node.line}</span>
      `;
      
      // Focus source code function on click
      div.addEventListener('click', () => {
        scrollToLine(node.line);
      });

      astTree.appendChild(div);
    });
    lucide.createIcons();
  }

  // Render diagnostic linter feedback
  if (issues.length === 0) {
    linterLogs.innerHTML = `
      <div class="text-green-400 flex items-center gap-2 bg-[#1e1e2e]/50 p-2 rounded border border-green-500/20">
        <i data-lucide="check-circle" class="w-3.5 h-3.5 shrink-0"></i>
        <span>No warnings detected. Code satisfies strict inspection syntax.</span>
      </div>
    `;
  } else {
    issues.forEach(issue => {
      const log = document.createElement('div');
      const isErr = issue.severity === 'error';
      log.className = `flex gap-2 p-2 rounded border \${isErr ? 'bg-[#f38ba8]/10 border-[#f38ba8]/30 text-[#f38ba8]' : 'bg-[#f9e2af]/10 border-[#f9e2af]/30 text-[#f9e2af]'}`;
      log.innerHTML = `
        <i data-lucide="\${isErr ? 'alert-octagon' : 'alert-triangle'}" class="w-3.5 h-3.5 shrink-0 mt-0.5"></i>
        <span>\${issue.text}</span>
      `;
      linterLogs.appendChild(log);
    });
  }
  lucide.createIcons();
}

// Helper functions
function findLineNum(code, index) {
  return code.substring(0, index).split('\n').length;
}

function scrollToLine(lineNum) {
  const lines = editorEl.value.split('\n');
  let offset = 0;
  for (let i = 0; i < lineNum - 1; i++) {
    offset += lines[i].length + 1;
  }
  editorEl.focus();
  editorEl.setSelectionRange(offset, offset + lines[lineNum - 1].length);
}

// Quick beautiful formatter
function formatCurrentCode() {
  const code = editorEl.value;
  const lang = virtualFiles[currentFileIndex].language;
  let formatted = code;

  if (lang === 'javascript') {
    formatted = code
      .replace(/;\\s*$/gm, ';')
      .replace(/{\\s*$/gm, ' {\\n')
      .split('\\n')
      .map(line => line.trim())
      .filter((line, idx, arr) => !(line === '' && arr[idx - 1] === ''))
      .join('\\n');
      
    let indent = 0;
    formatted = formatted.split('\\n').map(line => {
      if (line.includes('}')) indent = Math.max(0, indent - 1);
      const indentedLine = '  '.repeat(indent) + line;
      if (line.includes('{')) indent++;
      return indentedLine;
    }).join('\\n');
  } else if (lang === 'html' || lang === 'css') {
    formatted = code.split('\\n').map(line => line.trim()).join('\\n');
  }

  editorEl.value = formatted;
  virtualFiles[currentFileIndex].content = formatted;
  updateLineNumbers();
  runInspection();
}

// Simple code minimizer
function minifyCurrentCode() {
  const code = editorEl.value;
  const minified = code
    .replace(/\\/\\*[\\s\\S]*?\\*\\/|([^\\\\:]|^)\\/\\/.*$/gm, '$1')
    .replace(/\\s+/g, ' ')
    .replace(/\\s*([{};,])\\s*/g, '$1')
    .trim();
  editorEl.value = minified;
  virtualFiles[currentFileIndex].content = minified;
  updateLineNumbers();
  runInspection();
}

// Start App
window.addEventListener('DOMContentLoaded', init);
```
End file
```
### Code Inspector Setup Complete.
All files are sequential, starting with index.html. The application structural boundaries are now closed. 
```