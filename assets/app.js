const brandControlsContainer = document.querySelector('#brand-controls');
const typographyControlsContainer = document.querySelector('#typography-controls');
const componentControlsContainer = document.querySelector('#component-controls');
const presetSelect = document.querySelector('#preset-select');
const previewArea = document.querySelector('#preview-area');
const resetButton = document.querySelector('#reset-config');
const generatePaletteButton = document.querySelector('#generate-palette');
const downloadConfigButton = document.querySelector('#download-config');
const copyCssButton = document.querySelector('#copy-css');
const saveStorageButton = document.querySelector('#save-to-storage');
const loadStorageButton = document.querySelector('#load-from-storage');
const importInput = document.querySelector('#import-config');

const STORAGE_KEY = 'woodmart-theme-utility-config';
const GOOGLE_FONTS_API = 'https://fonts.googleapis.com/css2?family=';

const fontPairs = [
  {
    label: 'Poppins & Inter',
    heading: 'Poppins',
    body: 'Inter',
    preview: 'Современная геометрия',
  },
  {
    label: 'Playfair Display & Source Sans Pro',
    heading: 'Playfair Display',
    body: 'Source Sans Pro',
    preview: 'Элегантный контраст',
  },
  {
    label: 'Montserrat & Lato',
    heading: 'Montserrat',
    body: 'Lato',
    preview: 'Минимализм и читабельность',
  },
  {
    label: 'DM Serif Display & Rubik',
    heading: 'DM Serif Display',
    body: 'Rubik',
    preview: 'Классика и гибкость',
  },
  {
    label: 'Raleway & Nunito',
    heading: 'Raleway',
    body: 'Nunito',
    preview: 'Лёгкость и мягкость',
  },
  {
    label: 'Oswald & Open Sans',
    heading: 'Oswald',
    body: 'Open Sans',
    preview: 'Динамика и нейтральность',
  },
  {
    label: 'Merriweather & Work Sans',
    heading: 'Merriweather',
    body: 'Work Sans',
    preview: 'Редакционный стиль',
  },
];

const presets = [
  {
    id: 'default',
    label: 'Стандарт Woodmart',
    config: {
      colors: {
        primary: '#255946',
        secondary: '#ba9158',
        accent: '#cfb691',
        background: '#f6f5f2',
        surface: '#ffffff',
        text: '#1f1b16',
        muted: '#5a5348',
        border: '#ded9d0',
        success: '#2f8f67',
        warning: '#d29e3a',
        danger: '#c4493b',
      },
      typography: {
        pair: fontPairs[0].label,
        baseSize: 16,
        headingScale: 1.22,
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      components: {
        radius: 18,
        buttonHeight: 48,
        cardShadow: 18,
        contentWidth: 1280,
      },
    },
  },
  {
    id: 'nordic',
    label: 'Nordic Calm',
    config: {
      colors: {
        primary: '#1d5c63',
        secondary: '#417d7a',
        accent: '#f4d19b',
        background: '#f6f6f2',
        surface: '#ffffff',
        text: '#0f1920',
        muted: '#4d5d67',
        border: '#d5dfe7',
        success: '#2a9d8f',
        warning: '#e9c46a',
        danger: '#e76f51',
      },
      typography: {
        pair: fontPairs[2].label,
        baseSize: 17,
        headingScale: 1.28,
        lineHeight: 1.65,
        letterSpacing: 0.4,
      },
      components: {
        radius: 20,
        buttonHeight: 50,
        cardShadow: 12,
        contentWidth: 1320,
      },
    },
  },
  {
    id: 'artisan',
    label: 'Craft & Artisan',
    config: {
      colors: {
        primary: '#7c4f2d',
        secondary: '#d69f7e',
        accent: '#f6d5b3',
        background: '#f3ede7',
        surface: '#ffffff',
        text: '#2c1a10',
        muted: '#71523f',
        border: '#e2d5c8',
        success: '#789262',
        warning: '#c47f30',
        danger: '#a94442',
      },
      typography: {
        pair: fontPairs[3].label,
        baseSize: 17,
        headingScale: 1.34,
        lineHeight: 1.7,
        letterSpacing: 0.2,
      },
      components: {
        radius: 22,
        buttonHeight: 52,
        cardShadow: 24,
        contentWidth: 1200,
      },
    },
  },
  {
    id: 'fresh',
    label: 'Fresh Organic',
    config: {
      colors: {
        primary: '#4c9a2a',
        secondary: '#d4b483',
        accent: '#f5f1e3',
        background: '#f3f7ee',
        surface: '#ffffff',
        text: '#1a2c16',
        muted: '#517053',
        border: '#dbe5cf',
        success: '#3b9c5f',
        warning: '#e0b341',
        danger: '#d75a4a',
      },
      typography: {
        pair: fontPairs[4].label,
        baseSize: 16,
        headingScale: 1.24,
        lineHeight: 1.62,
        letterSpacing: 0.1,
      },
      components: {
        radius: 18,
        buttonHeight: 46,
        cardShadow: 14,
        contentWidth: 1240,
      },
    },
  },
];

const initialConfig = structuredClone(presets[0].config);

const state = {
  colors: { ...initialConfig.colors },
  typography: { ...initialConfig.typography },
  components: { ...initialConfig.components },
};

const controlBuilders = {
  color({ key, label }) {
    const template = document.querySelector('#color-control-template');
    const node = template.content.firstElementChild.cloneNode(true);
    const colorInput = node.querySelector('.color-input');
    const textInput = node.querySelector('.text-input');
    const labelNode = node.querySelector('.label');

    labelNode.textContent = label;
    colorInput.value = state.colors[key];
    textInput.value = state.colors[key];

    const handleInput = (value) => {
      const normalized = normalizeColor(value);
      if (!normalized) {
        textInput.classList.add('invalid');
        return;
      }
      textInput.classList.remove('invalid');
      state.colors[key] = normalized;
      colorInput.value = normalized;
      textInput.value = normalized;
      updateTheme();
    };

    colorInput.addEventListener('input', (event) => {
      handleInput(event.target.value);
    });

    textInput.addEventListener('change', (event) => {
      handleInput(event.target.value);
    });

    return node;
  },
  range({ key, label, min, max, step, format, target }) {
    const template = document.querySelector('#range-control-template');
    const node = template.content.firstElementChild.cloneNode(true);
    const range = node.querySelector('.range-input');
    const labelNode = node.querySelector('.label');
    const valueNode = node.querySelector('.value');

    range.min = min;
    range.max = max;
    range.step = step ?? 1;
    range.value = state[target][key];
    labelNode.textContent = label;
    valueNode.textContent = format(state[target][key]);

    range.addEventListener('input', (event) => {
      const nextValue = Number(event.target.value);
      state[target][key] = nextValue;
      valueNode.textContent = format(nextValue);
      updateTheme();
    });

    return node;
  },
  select({ key, label, options, target }) {
    const template = document.querySelector('#select-control-template');
    const node = template.content.firstElementChild.cloneNode(true);
    const select = node.querySelector('.select-input');
    const labelNode = node.querySelector('.label');

    labelNode.textContent = label;
    select.innerHTML = options
      .map((option) => `<option value="${option.value}">${option.label}</option>`)
      .join('');
    select.value = state[target][key];

    select.addEventListener('change', (event) => {
      state[target][key] = event.target.value;
      updateTheme();
    });

    return node;
  },
};

function buildControls() {
  brandControlsContainer.innerHTML = '';
  typographyControlsContainer.innerHTML = '';
  componentControlsContainer.innerHTML = '';

  const colorKeys = [
    { key: 'primary', label: 'Основной цвет' },
    { key: 'secondary', label: 'Вторичный цвет' },
    { key: 'accent', label: 'Акцент / фон карточек' },
    { key: 'background', label: 'Фон страницы' },
    { key: 'surface', label: 'Фон блоков' },
    { key: 'text', label: 'Цвет текста' },
    { key: 'muted', label: 'Вторичный текст' },
    { key: 'border', label: 'Границы и разделители' },
    { key: 'success', label: 'Успех' },
    { key: 'warning', label: 'Предупреждение' },
    { key: 'danger', label: 'Ошибка' },
  ];

  colorKeys
    .map((descriptor) => controlBuilders.color(descriptor))
    .forEach((node) => brandControlsContainer.append(node));

  const fontOptions = fontPairs.map((pair) => ({
    label: `${pair.label} — ${pair.preview}`,
    value: pair.label,
  }));

  typographyControlsContainer.append(
    controlBuilders.select({
      key: 'pair',
      label: 'Пара шрифтов',
      target: 'typography',
      options: fontOptions,
    }),
  );

  const typographyRanges = [
    {
      key: 'baseSize',
      label: 'Базовый размер (px)',
      min: 14,
      max: 20,
      step: 1,
      format: (value) => `${value}px`,
      target: 'typography',
    },
    {
      key: 'headingScale',
      label: 'Множитель заголовков',
      min: 1.1,
      max: 1.5,
      step: 0.02,
      format: (value) => value.toFixed(2),
      target: 'typography',
    },
    {
      key: 'lineHeight',
      label: 'Межстрочный интервал',
      min: 1.4,
      max: 1.9,
      step: 0.02,
      format: (value) => value.toFixed(2),
      target: 'typography',
    },
    {
      key: 'letterSpacing',
      label: 'Кернинг (px)',
      min: -1,
      max: 2,
      step: 0.1,
      format: (value) => `${value.toFixed(1)}px`,
      target: 'typography',
    },
  ];

  typographyRanges
    .map((descriptor) => controlBuilders.range(descriptor))
    .forEach((node) => typographyControlsContainer.append(node));

  const componentRanges = [
    {
      key: 'radius',
      label: 'Скругление блоков (px)',
      min: 4,
      max: 36,
      step: 1,
      format: (value) => `${value}px`,
      target: 'components',
    },
    {
      key: 'buttonHeight',
      label: 'Высота кнопок (px)',
      min: 36,
      max: 64,
      step: 2,
      format: (value) => `${value}px`,
      target: 'components',
    },
    {
      key: 'cardShadow',
      label: 'Мягкость тени',
      min: 0,
      max: 32,
      step: 1,
      format: (value) => value,
      target: 'components',
    },
    {
      key: 'contentWidth',
      label: 'Ширина контента (px)',
      min: 1080,
      max: 1440,
      step: 10,
      format: (value) => `${value}px`,
      target: 'components',
    },
  ];

  componentRanges
    .map((descriptor) => controlBuilders.range(descriptor))
    .forEach((node) => componentControlsContainer.append(node));
}

function updateTheme() {
  applyColorVariables();
  applyTypography();
  applyComponents();
  updatePresetSelection();
}

function updatePresetSelection() {
  const matchingPreset = presets.find((preset) =>
    deepEqual(preset.config, state),
  );

  presetSelect.value = matchingPreset ? matchingPreset.id : 'custom';
}

function applyColorVariables() {
  const root = document.documentElement;
  const { colors } = state;

  const derived = derivePalette(colors.primary);

  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--primary-strong', derived.strong);
  root.style.setProperty('--primary-light', derived.light);
  root.style.setProperty('--primary-very-light', derived.veryLight);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--surface', colors.background);
  root.style.setProperty('--surface-alt', colors.surface);
  root.style.setProperty('--text-primary', colors.text);
  root.style.setProperty('--text-muted', hexToRgba(colors.muted, 0.75));
  root.style.setProperty('--border-color', hexToRgba(colors.border, 0.38));
  root.style.setProperty('--success', colors.success);
  root.style.setProperty('--warning', colors.warning);
  root.style.setProperty('--danger', colors.danger);

  previewArea.style.setProperty('--primary', colors.primary);
  previewArea.style.setProperty('--primary-strong', derived.strong);
  previewArea.style.setProperty('--primary-very-light', derived.veryLight);
  previewArea.style.setProperty('--secondary', colors.secondary);
  previewArea.style.setProperty('--accent', colors.accent);
  previewArea.style.setProperty('--surface', colors.background);
  previewArea.style.setProperty('--surface-alt', colors.surface);
  previewArea.style.setProperty('--text-primary', colors.text);
  previewArea.style.setProperty('--text-muted', hexToRgba(colors.muted, 0.75));
  previewArea.style.setProperty('--border-color', hexToRgba(colors.border, 0.38));
}

function applyTypography() {
  const { typography } = state;
  const pair = fontPairs.find((pair) => pair.label === typography.pair) ?? fontPairs[0];

  loadFont(pair.heading, 'heading-font');
  loadFont(pair.body, 'body-font');

  document.documentElement.style.setProperty('--font-heading', `'${pair.heading}', serif`);
  document.documentElement.style.setProperty('--font-body', `'${pair.body}', sans-serif`);
  document.documentElement.style.setProperty('--base-font-size', `${typography.baseSize}px`);
  document.documentElement.style.setProperty('--line-height', typography.lineHeight);
  document.documentElement.style.setProperty('--letter-spacing', `${typography.letterSpacing}px`);
  document.documentElement.style.setProperty('--heading-scale', typography.headingScale);
}

function applyComponents() {
  const { components } = state;
  const shadow = components.cardShadow;
  const shadowValue = shadow
    ? `0 ${shadow / 2}px ${shadow * 2}px rgba(31, 27, 22, ${Math.min(0.04 + shadow / 200, 0.22)})`
    : 'none';

  document.documentElement.style.setProperty('--radius-base', `${components.radius}px`);
  document.documentElement.style.setProperty('--button-height', `${components.buttonHeight}px`);
  document.documentElement.style.setProperty('--shadow-soft', shadowValue);
  document.documentElement.style.setProperty('--content-width', `${components.contentWidth}px`);
}

function loadFont(fontName, id) {
  const formattedName = fontName.replace(/\s+/g, '+');
  const fontLinkId = `font-link-${id}`;
  let fontLink = document.getElementById(fontLinkId);

  if (!fontLink) {
    fontLink = document.createElement('link');
    fontLink.id = fontLinkId;
    fontLink.rel = 'stylesheet';
    document.head.append(fontLink);
  }

  fontLink.href = `${GOOGLE_FONTS_API}${formattedName}:wght@400;500;600;700&display=swap`;
}

function derivePalette(hex) {
  const hsl = hexToHsl(hex);
  if (!hsl) {
    return {
      strong: hex,
      light: hex,
      veryLight: hex,
    };
  }

  return {
    strong: hslToHex({ ...hsl, l: clamp(hsl.l - 0.18, 0, 1) }),
    light: hslToHex({ ...hsl, l: clamp(hsl.l + 0.16, 0, 1) }),
    veryLight: hslToHex({ ...hsl, l: clamp(hsl.l + 0.3, 0, 1) }),
  };
}

function normalizeColor(value) {
  if (!value) return null;
  const hex = value.trim().toLowerCase();
  if (/^#([0-9a-f]{3}){1,2}$/i.test(hex)) {
    return expandHex(hex);
  }
  return null;
}

function expandHex(hex) {
  if (hex.length === 4) {
    return `#${[1, 2, 3].map((index) => hex[index] + hex[index]).join('')}`;
  }
  return hex;
}

function hexToHsl(hex) {
  const normalized = normalizeColor(hex);
  if (!normalized) return null;
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    switch (max) {
      case r:
        h = ((g - b) / delta) % 6;
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      default:
        h = (r - g) / delta + 4;
        break;
    }

    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  return { h: h / 360, s: clamp(s, 0, 1), l: clamp(l, 0, 1) };
}

function hslToHex({ h, s, l }) {
  const hue = h * 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;

  const rgb = (() => {
    if (hue < 60) return [c, x, 0];
    if (hue < 120) return [x, c, 0];
    if (hue < 180) return [0, c, x];
    if (hue < 240) return [0, x, c];
    if (hue < 300) return [x, 0, c];
    return [c, 0, x];
  })();

  return `#${rgb
    .map((value) => Math.round((value + m) * 255))
    .map((component) => component.toString(16).padStart(2, '0'))
    .join('')}`;
}

function hexToRgba(hex, alpha = 1) {
  const normalized = normalizeColor(hex);
  if (!normalized) return `rgba(0,0,0,${alpha})`;
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => deepEqual(a[key], b[key]));
}

function setupPresets() {
  presetSelect.innerHTML = `
    <option value="custom">Своя конфигурация</option>
    ${presets.map((preset) => `<option value="${preset.id}">${preset.label}</option>`).join('')}
  `;
  presetSelect.value = 'custom';
  presetSelect.addEventListener('change', (event) => {
    const selected = presets.find((preset) => preset.id === event.target.value);
    if (!selected) return;
    applyConfig(selected.config);
  });
}

function applyConfig(config) {
  state.colors = { ...config.colors };
  state.typography = { ...config.typography };
  state.components = { ...config.components };
  buildControls();
  updateTheme();
}

function resetConfig() {
  applyConfig(initialConfig);
}

function generatePalette() {
  const next = derivePalette(state.colors.primary);
  state.colors.secondary = next.strong;
  state.colors.accent = next.light;
  state.colors.muted = next.strong;
  state.colors.border = next.light;
  state.colors.surface = lightenHex(state.colors.background, 0.08);
  buildControls();
  updateTheme();
}

function lightenHex(hex, amount) {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  return hslToHex({ ...hsl, l: clamp(hsl.l + amount, 0, 1) });
}

function downloadConfig() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'woodmart-config.json';
  link.click();
  URL.revokeObjectURL(url);
}

function copyCssVariables() {
  const css = `:root {\n${formatCssVariables()}\n}`;
  navigator.clipboard.writeText(css).then(() => {
    copyCssButton.textContent = 'Скопировано!';
    setTimeout(() => {
      copyCssButton.textContent = 'Скопировать CSS';
    }, 1800);
  });
}

function formatCssVariables() {
  const { colors, typography, components } = state;
  const pair = fontPairs.find((pair) => pair.label === typography.pair) ?? fontPairs[0];

  const derived = derivePalette(colors.primary);
  const variables = {
    '--wd-primary': colors.primary,
    '--wd-primary-strong': derived.strong,
    '--wd-primary-light': derived.light,
    '--wd-surface': colors.background,
    '--wd-surface-alt': colors.surface,
    '--wd-accent': colors.accent,
    '--wd-border': colors.border,
    '--wd-text': colors.text,
    '--wd-text-muted': hexToRgba(colors.muted, 0.75),
    '--wd-success': colors.success,
    '--wd-warning': colors.warning,
    '--wd-danger': colors.danger,
    '--wd-font-heading': `'${pair.heading}', serif`,
    '--wd-font-body': `'${pair.body}', sans-serif`,
    '--wd-font-size-base': `${typography.baseSize}px`,
    '--wd-line-height': typography.lineHeight,
    '--wd-letter-spacing': `${typography.letterSpacing}px`,
    '--wd-heading-scale': typography.headingScale,
    '--wd-radius': `${components.radius}px`,
    '--wd-button-height': `${components.buttonHeight}px`,
    '--wd-shadow': document.documentElement.style.getPropertyValue('--shadow-soft') || 'none',
    '--wd-container-width': `${components.contentWidth}px`,
  };

  return Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  saveStorageButton.textContent = 'Сохранено!';
  setTimeout(() => {
    saveStorageButton.textContent = 'Сохранить в браузере';
  }, 1800);
}

function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;
  try {
    const parsed = JSON.parse(data);
    applyConfig(parsed);
  } catch (error) {
    console.error('Не удалось загрузить конфигурацию', error);
  }
}

function importConfig(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      applyConfig(parsed);
    } catch (error) {
      console.error('Некорректный JSON', error);
    }
  };
  reader.readAsText(file);
}

resetButton.addEventListener('click', resetConfig);
generatePaletteButton.addEventListener('click', generatePalette);
downloadConfigButton.addEventListener('click', downloadConfig);
copyCssButton.addEventListener('click', copyCssVariables);
saveStorageButton.addEventListener('click', saveToStorage);
loadStorageButton.addEventListener('click', loadFromStorage);
importInput.addEventListener('change', (event) => {
  if (!event.target.files?.length) return;
  importConfig(event.target.files[0]);
  event.target.value = '';
});

buildControls();
setupPresets();
updateTheme();

window.woodmartUtility = {
  getConfig: () => structuredClone(state),
  applyConfig,
};
