import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import logoImage from './assets/logo.png';
import { 
  Search, Plus, Key, Link, Calendar, StickyNote, Eye, EyeOff, Copy, Check, 
  Trash2, X, Edit3, Settings, Folder, Star, Heart, Bookmark, Flag, Tag,
  CreditCard, Phone, Mail, Home, Briefcase, ShoppingBag, Gift, Music,
  Camera, Film, Book, Gamepad2, Plane, Car, Coffee, Utensils, Pill,
  GraduationCap, Building2, Users, Lock, Shield, Wifi, Server, Code,
  FileText, Archive, Clock, Bell, Map, Globe, Zap, Award, Target, Unlock,
  AlertCircle, Receipt, CircleDot, CheckCircle2, FileWarning, ImagePlus,
  ChevronLeft, ChevronRight, BellOff, BellRing, Volume2, VolumeX,
  LogOut, User, UserPlus, Minus, Square, Maximize2, ChevronDown,
  Upload, File, FileImage, Paperclip, Download, ArrowUpDown, CalendarDays,
  ArrowUp, ArrowDown, Diamond, XCircle, RefreshCw, Crown, GripVertical, Filter
} from 'lucide-react';

// 可选图标库
const ICON_OPTIONS = [
  { name: 'StickyNote', icon: StickyNote },
  { name: 'Key', icon: Key },
  { name: 'Link', icon: Link },
  { name: 'Calendar', icon: Calendar },
  { name: 'Receipt', icon: Receipt },
  { name: 'Folder', icon: Folder },
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'Flag', icon: Flag },
  { name: 'Tag', icon: Tag },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'Phone', icon: Phone },
  { name: 'Mail', icon: Mail },
  { name: 'Home', icon: Home },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Gift', icon: Gift },
  { name: 'Music', icon: Music },
  { name: 'Camera', icon: Camera },
  { name: 'Film', icon: Film },
  { name: 'Book', icon: Book },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Plane', icon: Plane },
  { name: 'Car', icon: Car },
  { name: 'Coffee', icon: Coffee },
  { name: 'Utensils', icon: Utensils },
  { name: 'Pill', icon: Pill },
  { name: 'GraduationCap', icon: GraduationCap },
  { name: 'Building2', icon: Building2 },
  { name: 'Users', icon: Users },
  { name: 'Lock', icon: Lock },
  { name: 'Shield', icon: Shield },
  { name: 'Wifi', icon: Wifi },
  { name: 'Server', icon: Server },
  { name: 'Code', icon: Code },
  { name: 'FileText', icon: FileText },
  { name: 'Archive', icon: Archive },
  { name: 'Clock', icon: Clock },
  { name: 'Bell', icon: Bell },
  { name: 'Map', icon: Map },
  { name: 'Globe', icon: Globe },
  { name: 'Zap', icon: Zap },
  { name: 'Award', icon: Award },
  { name: 'Target', icon: Target },
  { name: 'Diamond', icon: Diamond },
  { name: 'Crown', icon: Crown },
];

// 可选颜色
const COLOR_OPTIONS = [
  { name: 'gray', bg: 'bg-gray-100', text: 'text-gray-600', ring: 'ring-gray-400' },
  { name: 'red', bg: 'bg-red-100', text: 'text-red-600', ring: 'ring-red-400' },
  { name: 'orange', bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-orange-400' },
  { name: 'amber', bg: 'bg-amber-100', text: 'text-amber-600', ring: 'ring-amber-400' },
  { name: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-600', ring: 'ring-yellow-400' },
  { name: 'lime', bg: 'bg-lime-100', text: 'text-lime-600', ring: 'ring-lime-400' },
  { name: 'green', bg: 'bg-green-100', text: 'text-green-600', ring: 'ring-green-400' },
  { name: 'emerald', bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-400' },
  { name: 'teal', bg: 'bg-teal-100', text: 'text-teal-600', ring: 'ring-teal-400' },
  { name: 'cyan', bg: 'bg-cyan-100', text: 'text-cyan-600', ring: 'ring-cyan-400' },
  { name: 'sky', bg: 'bg-sky-100', text: 'text-sky-600', ring: 'ring-sky-400' },
  { name: 'blue', bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-400' },
  { name: 'indigo', bg: 'bg-indigo-100', text: 'text-indigo-600', ring: 'ring-indigo-400' },
  { name: 'violet', bg: 'bg-violet-100', text: 'text-violet-600', ring: 'ring-violet-400' },
  { name: 'purple', bg: 'bg-purple-100', text: 'text-purple-600', ring: 'ring-purple-400' },
  { name: 'fuchsia', bg: 'bg-fuchsia-100', text: 'text-fuchsia-600', ring: 'ring-fuchsia-400' },
  { name: 'pink', bg: 'bg-pink-100', text: 'text-pink-600', ring: 'ring-pink-400' },
  { name: 'rose', bg: 'bg-rose-100', text: 'text-rose-600', ring: 'ring-rose-400' },
];

// 便签类型配置（含默认图标和颜色）
const NOTE_TYPES = [
  { id: 'simple', name: '简单文本', description: '标题 + 内容 + 图片', defaultPrivate: false, supportsImages: true, defaultIcon: 'StickyNote', defaultColor: 'gray' },
  { id: 'password', name: '账号密码', description: '账号 + 密码（可隐藏）', defaultPrivate: true, supportsImages: false, defaultIcon: 'Key', defaultColor: 'amber' },
  { id: 'link', name: '网址链接', description: '可点击跳转的链接', defaultPrivate: false, supportsImages: false, defaultIcon: 'Link', defaultColor: 'blue' },
  { id: 'date', name: '日期提醒', description: '显示倒计时 + 提醒', defaultPrivate: false, supportsImages: false, defaultIcon: 'Calendar', defaultColor: 'rose' },
  { id: 'expense', name: '报销记录', description: '金额、发票、状态 + 图片', defaultPrivate: false, supportsImages: true, defaultIcon: 'Receipt', defaultColor: 'emerald' },
  { id: 'membership', name: '会员管理', description: '会员到期提醒、费用统计', defaultPrivate: false, supportsImages: false, defaultIcon: 'Diamond', defaultColor: 'violet' },
];

// 报销状态
const EXPENSE_STATUS = [
  { id: 'not_invoiced', name: '未开发票', color: 'text-orange-600', bg: 'bg-orange-100', icon: FileWarning },
  { id: 'applied', name: '已申请未出票', color: 'text-purple-600', bg: 'bg-purple-100', icon: Clock },
  { id: 'invoiced', name: '已开发票未报销', color: 'text-blue-600', bg: 'bg-blue-100', icon: CircleDot },
  { id: 'reimbursed', name: '已报销', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2 },
];

// 会员类型选项
const MEMBERSHIP_TYPES = [
  { id: 'monthly_auto', name: '连续包月', days: 30, unit: '月' },
  { id: 'yearly_auto', name: '连续包年', days: 365, unit: '年' },
  { id: 'monthly', name: '月卡', days: 30, unit: '月' },
  { id: 'quarterly', name: '季卡', days: 90, unit: '季' },
  { id: 'yearly', name: '年卡', days: 365, unit: '年' },
  { id: 'custom', name: '自定义', days: 0, unit: '天' },
];

// 会员状态（自动计算）
const MEMBERSHIP_STATUS = [
  { id: 'active', name: '生效中', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle2 },
  { id: 'expiring', name: '即将到期', color: 'text-orange-600', bg: 'bg-orange-100', icon: AlertCircle },
  { id: 'expired', name: '已过期', color: 'text-gray-500', bg: 'bg-gray-100', icon: XCircle },
];

// 默认类别
const DEFAULT_CATEGORIES = [
  { id: 'password', name: '账号密码', iconName: 'Key', color: 'amber', noteType: 'password' },
  { id: 'link', name: '网址收藏', iconName: 'Link', color: 'blue', noteType: 'link' },
  { id: 'date', name: '重要日期', iconName: 'Calendar', color: 'rose', noteType: 'date' },
  { id: 'expense', name: '报销记录', iconName: 'Receipt', color: 'emerald', noteType: 'expense' },
  { id: 'membership', name: '会员管理', iconName: 'Diamond', color: 'violet', noteType: 'membership' },
  { id: 'note', name: '通用备忘', iconName: 'StickyNote', color: 'gray', noteType: 'simple' },
];

const INITIAL_NOTES = [];

// 安全问题列表
const SECURITY_QUESTIONS = [
  { id: 'school', question: '你的小学叫什么名字？' },
  { id: 'pet', question: '你的第一只宠物叫什么？' },
  { id: 'city', question: '你出生在哪个城市？' },
  { id: 'friend', question: '你最好朋友的名字是？' },
  { id: 'movie', question: '你最喜欢的电影是？' },
  { id: 'food', question: '你最喜欢的食物是？' },
];

// ==================== 密码加密函数 ====================

// 使用 SHA-256 哈希加密密码（单向，用于存储）
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'tangtang_salt_2024'); // 添加盐值增加安全性
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// 验证密码是否匹配
async function verifyPassword(inputPassword, storedHash) {
  const inputHash = await hashPassword(inputPassword);
  return inputHash === storedHash;
}

// 简单对称加密（用于"记住密码"功能，需要能解密）
const ENCRYPT_KEY = 'tangtang_encrypt_key_2024';

function encryptPassword(password) {
  if (!password) return '';
  let result = '';
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i) ^ ENCRYPT_KEY.charCodeAt(i % ENCRYPT_KEY.length);
    result += String.fromCharCode(charCode);
  }
  // 转为 base64 避免特殊字符问题
  return btoa(encodeURIComponent(result));
}

function decryptPassword(encrypted) {
  if (!encrypted) return '';
  try {
    const decoded = decodeURIComponent(atob(encrypted));
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ ENCRYPT_KEY.charCodeAt(i % ENCRYPT_KEY.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  } catch {
    // 如果解密失败，可能是旧的明文格式，直接返回
    return encrypted;
  }
}

// ==================== 验证工具函数 ====================

// 计算字符串的"中文字符长度"（中文算1，英文/数字算0.5）
function getChineseCharLength(str) {
  let length = 0;
  for (const char of str) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      length += 1; // 中文字符算1
    } else {
      length += 0.5; // 英文、数字算0.5
    }
  }
  return length;
}

// 验证用户名：只能包含中文、英文、数字，且不超过8个中文字符长度
function validateUsername(username) {
  if (!username || username.trim() === '') {
    return { valid: false, message: '请输入用户名' };
  }
  
  // 检查是否只包含允许的字符（中文、英文大小写、数字）
  const validCharsPattern = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
  if (!validCharsPattern.test(username)) {
    return { valid: false, message: '用户名只能包含中文、英文和数字' };
  }
  
  // 检查长度（中文算1，英文/数字算0.5，总长度不超过8）
  const charLength = getChineseCharLength(username);
  if (charLength > 8) {
    return { valid: false, message: '用户名长度不能超过8个中文字符' };
  }
  
  if (charLength < 1) {
    return { valid: false, message: '用户名至少需要1个字符' };
  }
  
  return { valid: true, message: '' };
}

// 验证密码：6-18位，必须包含英文、数字、符号中的至少两种
function validatePassword(password) {
  if (!password) {
    return { valid: false, message: '请输入密码' };
  }
  
  if (password.length < 6) {
    return { valid: false, message: '密码长度不能少于6位' };
  }
  
  if (password.length > 18) {
    return { valid: false, message: '密码长度不能超过18位' };
  }
  
  // 检查包含的字符类型
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  
  const typeCount = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;
  
  if (typeCount < 2) {
    return { valid: false, message: '密码必须包含英文、数字、符号中的至少两种' };
  }
  
  return { valid: true, message: '' };
}

// ==================== 登录注册组件 ====================

function AuthPage({ onLogin, registeredUsers, setRegisteredUsers, savedAccounts, setSavedAccounts }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 记住密码相关（账号自动记住，密码需要勾选）
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);
  const savedAccountsRef = useRef(null);
  
  // 安全问题相关
  const [securityQuestion, setSecurityQuestion] = useState('school');
  const [securityAnswer, setSecurityAnswer] = useState('');
  
  // 初始化：如果有保存的账号，自动填充最近使用的
  useEffect(() => {
    if (savedAccounts.length > 0 && mode === 'login' && !username) {
      const lastAccount = savedAccounts[0]; // 最近使用的账号在最前面
      setUsername(lastAccount.username);
      if (lastAccount.rememberPassword) {
        // 支持新旧两种格式
        const savedPassword = lastAccount.encryptedPassword 
          ? decryptPassword(lastAccount.encryptedPassword) 
          : lastAccount.password || '';
        if (savedPassword) {
          setPassword(savedPassword);
          setRememberPassword(true);
        }
      }
    }
  }, [savedAccounts, mode]);
  
  // 检查账号是否已在其他窗口登录
  const checkUserSession = async (userId) => {
    try {
      // 优先使用 Electron API
      if (window.electronAPI?.checkUserSession) {
        return await window.electronAPI.checkUserSession(userId);
      }
      // 浏览器环境的备用方案
      const sessionsData = localStorage.getItem('activeLoginSession');
      if (sessionsData) {
        const sessions = JSON.parse(sessionsData);
        if (sessions[userId]) {
          return true;
        }
      }
      return false;
    } catch {
      return false;
    }
  };
  
  // 忘记密码相关
  const [forgotStep, setForgotStep] = useState(1); // 1: 输入用户名, 2: 回答问题, 3: 设置新密码
  const [forgotUser, setForgotUser] = useState(null);
  const [forgotAnswer, setForgotAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // 焦点状态
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (savedAccountsRef.current && !savedAccountsRef.current.contains(e.target)) {
        setShowSavedAccounts(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    if (mode === 'login') {
      // 登录逻辑
      const user = registeredUsers.find(u => u.username === username);
      if (!user) {
        setErrors({ general: '用户名不存在' });
        return;
      }
      
      // 验证密码（支持新旧两种格式）
      let passwordMatch = false;
      if (user.passwordHash) {
        // 新格式：使用哈希验证
        passwordMatch = await verifyPassword(password, user.passwordHash);
      } else {
        // 旧格式：明文比对（兼容旧数据）
        passwordMatch = user.password === password;
      }
      
      if (!passwordMatch) {
        setErrors({ general: '密码错误' });
        return;
      }
      
      // 检查该账号是否已在其他窗口登录
      const isLoggedIn = await checkUserSession(user.id);
      if (isLoggedIn) {
        setErrors({ general: '该账号已在其他窗口登录，请先关闭其他窗口' });
        return;
      }
      
      setIsSubmitting(true);
      
      // 尝试获取用户头像
      let userAvatar = null;
      try {
        if (window.electronAPI) {
          const savedData = await window.electronAPI.loadData();
          const userKey = `userData_${user.id}`;
          if (savedData && savedData[userKey] && savedData[userKey].avatar) {
            userAvatar = savedData[userKey].avatar;
          }
        } else {
          const userKey = `userData_${user.id}`;
          const stored = localStorage.getItem(userKey);
          if (stored) {
            const userData = JSON.parse(stored);
            userAvatar = userData.avatar || null;
          }
        }
      } catch (error) {
        console.error('获取头像失败:', error);
      }
      
      setTimeout(() => {
        // 自动保存账号（账号始终保存，密码根据勾选决定）
        const existingIndex = savedAccounts.findIndex(a => a.username === username);
        const accountData = {
          username,
          encryptedPassword: rememberPassword ? encryptPassword(password) : '', // 加密存储
          rememberPassword: rememberPassword,
          lastUsed: Date.now(),
          avatar: userAvatar // 保存头像
        };
        
        let updatedAccounts;
        if (existingIndex >= 0) {
          // 更新已有账号，移到最前面
          updatedAccounts = [
            accountData,
            ...savedAccounts.filter((_, i) => i !== existingIndex)
          ];
        } else {
          // 新账号，添加到最前面
          updatedAccounts = [accountData, ...savedAccounts];
        }
        setSavedAccounts(updatedAccounts);
        
        onLogin(user);
      }, 500);
    } else if (mode === 'register') {
      // 验证用户名
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        setErrors(prev => ({ ...prev, username: usernameValidation.message }));
        return;
      }
      
      // 检查用户名是否已存在
      if (registeredUsers.some(u => u.username === username)) {
        setErrors({ username: '该用户名已被注册' });
        return;
      }
      
      // 验证密码
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        setErrors(prev => ({ ...prev, password: passwordValidation.message }));
        return;
      }
      
      if (password !== confirmPassword) {
        setErrors({ confirmPassword: '两次输入的密码不一致' });
        return;
      }
      
      // 验证安全问题答案
      if (!securityAnswer.trim()) {
        setErrors({ securityAnswer: '请填写安全问题答案' });
        return;
      }
      
      setIsSubmitting(true);
      
      // 加密密码和安全问题答案
      const passwordHash = await hashPassword(password);
      const securityAnswerHash = await hashPassword(securityAnswer.trim().toLowerCase());
      
      const newUser = {
        id: Date.now(),
        username,
        passwordHash, // 使用哈希存储密码
        securityQuestion,
        securityAnswerHash, // 使用哈希存储答案
        createdAt: new Date().toISOString()
      };
      
      setTimeout(() => {
        setRegisteredUsers([...registeredUsers, newUser]);
        onLogin(newUser);
      }, 500);
    }
  };
  
  // 忘记密码 - 验证用户名
  const handleForgotFindUser = (e) => {
    e.preventDefault();
    setErrors({});
    
    const user = registeredUsers.find(u => u.username === username);
    if (!user) {
      setErrors({ general: '用户名不存在' });
      return;
    }
    
    // 检查是否设置了安全问题（支持新旧格式）
    const hasSecurityQuestion = user.securityQuestion && (user.securityAnswerHash || user.securityAnswer);
    if (!hasSecurityQuestion) {
      setErrors({ general: '该账号未设置安全问题，无法找回密码' });
      return;
    }
    
    setForgotUser(user);
    setForgotStep(2);
  };
  
  // 忘记密码 - 验证安全问题
  const handleForgotVerify = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const inputAnswer = forgotAnswer.trim().toLowerCase();
    let answerMatch = false;
    
    if (forgotUser.securityAnswerHash) {
      // 新格式：哈希比对
      answerMatch = await verifyPassword(inputAnswer, forgotUser.securityAnswerHash);
    } else {
      // 旧格式：明文比对
      answerMatch = inputAnswer === forgotUser.securityAnswer;
    }
    
    if (!answerMatch) {
      setErrors({ general: '答案错误' });
      return;
    }
    
    setForgotStep(3);
  };
  
  // 忘记密码 - 设置新密码
  const handleForgotReset = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setErrors({ password: passwordValidation.message });
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setErrors({ confirmPassword: '两次输入的密码不一致' });
      return;
    }
    
    // 加密新密码
    const newPasswordHash = await hashPassword(newPassword);
    
    // 更新密码（使用新的哈希格式，删除旧的明文密码）
    const updatedUsers = registeredUsers.map(u => 
      u.id === forgotUser.id 
        ? { ...u, passwordHash: newPasswordHash, password: undefined } 
        : u
    );
    setRegisteredUsers(updatedUsers);
    
    // 重置状态并返回登录
    resetForm();
    setMode('login');
    setErrors({ general: '密码重置成功，请重新登录' });
  };
  
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setSecurityAnswer('');
    setForgotStep(1);
    setForgotUser(null);
    setForgotAnswer('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrors({});
    setRememberPassword(false);
    setShowSavedAccounts(false);
  };
  
  // 选择已保存的账号
  const handleSelectSavedAccount = (account) => {
    setUsername(account.username);
    // 如果之前勾选了记住密码，自动填充密码
    if (account.rememberPassword) {
      // 支持新旧两种格式
      const savedPassword = account.encryptedPassword 
        ? decryptPassword(account.encryptedPassword) 
        : account.password || '';
      if (savedPassword) {
        setPassword(savedPassword);
        setRememberPassword(true);
      } else {
        setPassword('');
        setRememberPassword(false);
      }
    } else {
      setPassword('');
      setRememberPassword(false);
    }
    setShowSavedAccounts(false);
  };
  
  // 删除已保存的账号
  const handleDeleteSavedAccount = (e, accountUsername) => {
    e.stopPropagation();
    const newSavedAccounts = savedAccounts.filter(a => a.username !== accountUsername);
    setSavedAccounts(newSavedAccounts);
    // 如果删除的是当前输入框中的账号，清空输入
    if (username === accountUsername) {
      setUsername('');
      setPassword('');
      setRememberPassword(false);
    }
  };
  
  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };
  
  // 注册时的用户名提示
  const getUsernameHint = () => {
    if (mode !== 'register') return null;
    if (!usernameFocused && !username) return null;
    
    // 检查重名
    const isDuplicate = registeredUsers.some(u => u.username === username);
    if (isDuplicate) {
      return <span className="text-red-500 text-xs">该用户名已被注册</span>;
    }
    
    const validation = validateUsername(username);
    
    // 如果有具体错误，显示具体错误信息
    if (username && !validation.valid) {
      return <span className="text-orange-500 text-xs">⚠ {validation.message}</span>;
    }
    
    // 验证通过
    if (username && validation.valid) {
      return <span className="text-green-500 text-xs">✓ 用户名可用</span>;
    }
    
    // 默认提示
    return <span className="text-orange-500 text-xs">用户名可包含中文、英文、数字，不超过8个中文字符</span>;
  };
  
  // 注册时的密码提示
  const getPasswordHint = () => {
    if (mode !== 'register') return null;
    if (!passwordFocused && !password) return null;
    
    const validation = validatePassword(password);
    
    // 如果有具体错误，显示具体错误信息
    if (password && !validation.valid) {
      return <span className="text-orange-500 text-xs">⚠ {validation.message}</span>;
    }
    
    // 验证通过，显示密码强度
    if (password && validation.valid) {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[^a-zA-Z0-9]/.test(password);
      const typeCount = [hasLetter, hasNumber, hasSymbol].filter(Boolean).length;
      
      if (typeCount >= 3) {
        return <span className="text-green-600 text-xs">✓ 密码强度：强</span>;
      }
      return <span className="text-green-500 text-xs">✓ 密码强度：中等</span>;
    }
    
    // 默认提示
    return <span className="text-orange-500 text-xs">6-18位，需包含字母/数字/符号至少两种</span>;
  };
  
  // 渲染忘记密码表单
  const renderForgotForm = () => {
    if (forgotStep === 1) {
      return (
        <form onSubmit={handleForgotFindUser} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入要找回的用户名"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            下一步
          </button>
        </form>
      );
    }
    
    if (forgotStep === 2) {
      const question = SECURITY_QUESTIONS.find(q => q.id === forgotUser.securityQuestion);
      return (
        <form onSubmit={handleForgotVerify} className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm font-medium">安全问题</p>
            <p className="text-blue-600 mt-1">{question?.question}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">你的答案</label>
            <input
              type="text"
              value={forgotAnswer}
              onChange={(e) => setForgotAnswer(e.target.value)}
              placeholder="请输入答案"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            验证
          </button>
        </form>
      );
    }
    
    if (forgotStep === 3) {
      return (
        <form onSubmit={handleForgotReset} className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 text-sm">✓ 验证成功，请设置新密码</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">新密码</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="6-18位，含字母/数字/符号至少两种"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
            />
            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">确认新密码</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="请再次输入新密码"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`}
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            重置密码
          </button>
        </form>
      );
    }
  };
  
  return (
    <div className="h-screen bg-transparent flex flex-col p-1">
      {/* 圆角容器 - 细边框 */}
      <div 
        className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col rounded-2xl overflow-hidden border border-gray-200/80"
      >
      {/* 自定义标题栏 - 仅在 Electron 中显示 */}
      {window.electronAPI && (
        <div 
          className="h-8 bg-white/50 backdrop-blur flex items-center justify-between px-2 shrink-0 rounded-t-2xl"
          style={{ WebkitAppRegion: 'drag' }}
        >
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="糖糖便签" className="w-5 h-5 object-contain" />
            <span className="text-xs text-gray-600 font-medium">糖糖便签</span>
          </div>
          <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' }}>
            <button
              onClick={() => window.electronAPI.windowMinimize()}
              className="w-10 h-8 flex items-center justify-center hover:bg-white/50 transition-colors"
            >
              <Minus size={14} className="text-gray-500" />
            </button>
            <button
              onClick={() => window.electronAPI.windowMaximize()}
              className="w-10 h-8 flex items-center justify-center hover:bg-white/50 transition-colors"
            >
              <Square size={12} className="text-gray-500" />
            </button>
            <button
              onClick={() => window.electronAPI.windowClose()}
              className="w-10 h-8 flex items-center justify-center hover:bg-red-500 group transition-colors"
            >
              <X size={14} className="text-gray-500 group-hover:text-white" />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden my-auto">
        {/* 顶部装饰 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-10 text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
            <img src={logoImage} alt="糖糖便签" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">糖糖便签</h1>
          <p className="text-white/80 text-sm">你的专属便签本</p>
        </div>
        
        {/* 表单区域 */}
        <div className="p-8">
          {/* 忘记密码模式 */}
          {mode === 'forgot' ? (
            <>
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => switchMode('login')} className="p-1 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft size={20} className="text-gray-500" />
                </button>
                <h2 className="text-lg font-semibold text-gray-800">找回密码</h2>
              </div>
              
              {errors.general && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${errors.general.includes('成功') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <AlertCircle size={16} className={errors.general.includes('成功') ? 'text-green-500' : 'text-red-500'} />
                  <span className={`text-sm ${errors.general.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>{errors.general}</span>
                </div>
              )}
              
              {renderForgotForm()}
            </>
          ) : (
            <>
              {/* 切换标签 */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => switchMode('login')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    mode === 'login' 
                      ? 'bg-white text-gray-800 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User size={16} className="inline mr-1.5 -mt-0.5" />
                  登录
                </button>
                <button
                  onClick={() => switchMode('register')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    mode === 'register' 
                      ? 'bg-white text-gray-800 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <UserPlus size={16} className="inline mr-1.5 -mt-0.5" />
                  注册
                </button>
              </div>
              
              {/* 错误/成功提示 */}
              {errors.general && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${errors.general.includes('成功') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <AlertCircle size={16} className={errors.general.includes('成功') ? 'text-green-500' : 'text-red-500'} />
                  <span className={`text-sm ${errors.general.includes('成功') ? 'text-green-600' : 'text-red-600'}`}>{errors.general}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 用户名输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">用户名</label>
                  <div className="relative" ref={savedAccountsRef}>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onFocus={() => {
                        setUsernameFocused(true);
                        if (mode === 'login' && savedAccounts.length > 0) {
                          setShowSavedAccounts(true);
                        }
                      }}
                      onBlur={() => setUsernameFocused(false)}
                      placeholder="请输入用户名"
                      className={`w-full px-4 py-2.5 ${mode === 'login' && savedAccounts.length > 0 ? 'pr-10' : ''} border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                    {mode === 'login' && savedAccounts.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowSavedAccounts(!showSavedAccounts)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown size={18} className={`transition-transform ${showSavedAccounts ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                    
                    {/* 已保存账号下拉列表 */}
                    {mode === 'login' && showSavedAccounts && savedAccounts.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        <div className="p-2 border-b border-gray-100">
                          <span className="text-xs text-gray-500">已保存的账号</span>
                        </div>
                        {savedAccounts.map((account, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectSavedAccount(account)}
                            className={`px-3 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between group ${
                              account.username === username ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {account.avatar ? (
                                <img 
                                  src={account.avatar} 
                                  alt={account.username} 
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                  <User size={14} className="text-white" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-800">{account.username}</p>
                                <p className="text-xs text-gray-400">
                                  {account.rememberPassword ? '已记住密码' : '未记住密码'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDeleteSavedAccount(e, account.username)}
                              className="p-1.5 rounded-md hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="删除此账号"
                            >
                              <X size={14} className="text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-1 min-h-[18px]">
                    {errors.username ? (
                      <span className="text-red-500 text-xs">{errors.username}</span>
                    ) : (
                      getUsernameHint()
                    )}
                  </div>
                </div>
                
                {/* 密码输入 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">密码</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="请输入密码"
                      className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                        errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="mt-1 min-h-[18px]">
                    {errors.password ? (
                      <span className="text-red-500 text-xs">{errors.password}</span>
                    ) : (
                      getPasswordHint()
                    )}
                  </div>
                </div>
                
                {/* 记住密码（仅登录时显示） */}
                {mode === 'login' && (
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberPassword}
                        onChange={(e) => setRememberPassword(e.target.checked)}
                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">记住密码</span>
                    </label>
                  </div>
                )}
                
                {/* 确认密码（仅注册时显示） */}
                {mode === 'register' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">确认密码</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="请再次输入密码"
                          className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                            errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <span className="text-red-500 text-xs mt-1 block">{errors.confirmPassword}</span>}
                      {!errors.confirmPassword && confirmPassword && confirmPassword === password && (
                        <span className="text-green-500 text-xs mt-1 block">✓ 密码一致</span>
                      )}
                    </div>
                    
                    {/* 安全问题 */}
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                      <p className="text-amber-800 text-sm font-medium mb-3">设置安全问题（用于找回密码）</p>
                      <div className="space-y-3">
                        <select
                          value={securityQuestion}
                          onChange={(e) => setSecurityQuestion(e.target.value)}
                          className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm"
                        >
                          {SECURITY_QUESTIONS.map(q => (
                            <option key={q.id} value={q.id}>{q.question}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={securityAnswer}
                          onChange={(e) => setSecurityAnswer(e.target.value)}
                          placeholder="请输入答案"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                            errors.securityAnswer ? 'border-red-300 focus:ring-red-500' : 'border-amber-200 focus:ring-amber-500'
                          }`}
                        />
                        {errors.securityAnswer && <span className="text-red-500 text-xs">{errors.securityAnswer}</span>}
                      </div>
                    </div>
                  </>
                )}
                
                {/* 提交按钮 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-lg font-medium text-white transition-all ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      处理中...
                    </span>
                  ) : (
                    mode === 'login' ? '登 录' : '注 册'
                  )}
                </button>
              </form>
              
              {/* 底部提示 */}
              <div className="mt-6 text-center text-sm text-gray-500">
                {mode === 'login' ? (
                  <>
                    <p>还没有账号？<button onClick={() => switchMode('register')} className="text-blue-500 hover:text-blue-600 font-medium">立即注册</button></p>
                    <p className="mt-2">
                      <button onClick={() => switchMode('forgot')} className="text-gray-400 hover:text-gray-600">忘记密码？</button>
                    </p>
                  </>
                ) : (
                  <p>已有账号？<button onClick={() => switchMode('login')} className="text-blue-500 hover:text-blue-600 font-medium">立即登录</button></p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}

// ==================== 工具函数 ====================

function getIconComponent(iconName) {
  const found = ICON_OPTIONS.find(i => i.name === iconName);
  return found ? found.icon : StickyNote;
}

function getColorClasses(colorName) {
  const found = COLOR_OPTIONS.find(c => c.name === colorName);
  return found || COLOR_OPTIONS[0];
}

function getDaysRemaining(dateStr) {
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

// 获取会员状态
function getMembershipStatus(endDate) {
  const days = getDaysRemaining(endDate);
  if (days < 0) return 'expired';
  if (days <= 7) return 'expiring';
  return 'active';
}

// 计算会员累计花费
function calculateMembershipTotalCost(note) {
  if (!note.startDate || !note.price) return note.price || 0;
  
  const start = new Date(note.startDate);
  const today = new Date();
  const membershipType = MEMBERSHIP_TYPES.find(t => t.id === note.membershipType);
  
  if (!membershipType || membershipType.id === 'custom') {
    // 自定义类型，返回单价
    return note.price;
  }
  
  // 计算已经过了多少个周期
  const daysPassed = Math.max(0, Math.ceil((today - start) / (1000 * 60 * 60 * 24)));
  const cycleDays = membershipType.days;
  const cycles = Math.ceil(daysPassed / cycleDays);
  
  return note.price * Math.max(1, cycles);
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m, s] = timeStr.split(':');
  return `${h}:${m}:${s}`;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-gray-100 transition-colors" title="复制">
      {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
    </button>
  );
}

// 图片预览弹窗
function ImageViewer({ images, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  if (!images || images.length === 0) return null;
  
  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `image-${currentIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button onClick={handleDownload} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors" title="下载图片">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>
      
      {images.length > 1 && (
        <>
          <button onClick={handlePrev} className="absolute left-4 p-2 text-white hover:bg-white/20 rounded-full">
            <ChevronLeft size={32} />
          </button>
          <button onClick={handleNext} className="absolute right-4 p-2 text-white hover:bg-white/20 rounded-full">
            <ChevronRight size={32} />
          </button>
        </>
      )}
      
      <img src={images[currentIndex]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
      
      {images.length > 1 && (
        <div className="absolute bottom-4 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

// 图片缩略图组件
function ImageThumbnails({ images, onImageClick }) {
  if (!images || images.length === 0) return null;
  
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {images.map((img, idx) => (
        <div key={idx} onClick={() => onImageClick(idx)} className="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200">
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

// 获取文件图标
function getFileIcon(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return FileImage;
  if (['pdf'].includes(ext)) return FileText;
  if (['doc', 'docx'].includes(ext)) return FileText;
  if (['txt'].includes(ext)) return FileText;
  return File;
}

// 获取文件类型标签
function getFileTypeLabel(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return '图片';
  if (['pdf'].includes(ext)) return 'PDF';
  if (['doc', 'docx'].includes(ext)) return 'Word';
  if (['txt'].includes(ext)) return '文本';
  return '文件';
}

// 格式化文件大小
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// 附件上传组件（支持图片和文件，支持拖拽）
function AttachmentUploader({ images = [], files = [], onImagesChange, onFilesChange }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // 处理文件
  const processFiles = (fileList) => {
    const newImages = [...images];
    const newFiles = [...files];
    
    Array.from(fileList).forEach(file => {
      if (file.type.startsWith('image/')) {
        // 图片文件
        const reader = new FileReader();
        reader.onload = (event) => {
          onImagesChange([...newImages, event.target.result]);
        };
        reader.readAsDataURL(file);
        newImages.push(null); // 占位，实际值在reader.onload中设置
      } else {
        // 其他文件（PDF、Word、TXT等）
        const reader = new FileReader();
        reader.onload = (event) => {
          const fileData = {
            name: file.name,
            size: file.size,
            type: file.type,
            data: event.target.result
          };
          onFilesChange([...newFiles, fileData]);
        };
        reader.readAsDataURL(file);
      }
    });
  };
  
  // 点击选择文件
  const handleFileChange = (e) => {
    processFiles(e.target.files);
    e.target.value = '';
  };
  
  // 拖拽事件
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };
  
  // 删除图片
  const handleRemoveImage = (index) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };
  
  // 删除文件
  const handleRemoveFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };
  
  // 下载文件
  const handleDownloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">附件（支持图片、PDF、Word、TXT）</label>
      
      {/* 拖拽上传区域 */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 transition-all ${
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {/* 已上传的图片 */}
        {images.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">图片</p>
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(idx)} 
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 已上传的文件 */}
        {files.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2">文件</p>
            <div className="space-y-2">
              {files.map((file, idx) => {
                const FileIcon = getFileIcon(file.name);
                return (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group">
                    <FileIcon size={20} className="text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{formatFileSize(file.size)} · {getFileTypeLabel(file.name)}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        type="button" 
                        onClick={() => handleDownloadFile(file)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="下载"
                      >
                        <Download size={14} className="text-gray-500" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFile(idx)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="删除"
                      >
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* 上传提示 */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center py-4 cursor-pointer"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
            isDragging ? 'bg-blue-100' : 'bg-gray-100'
          }`}>
            <Upload size={20} className={isDragging ? 'text-blue-500' : 'text-gray-400'} />
          </div>
          <p className="text-sm text-gray-500">
            {isDragging ? '松开鼠标上传文件' : '点击或拖拽文件到此处上传'}
          </p>
          <p className="text-xs text-gray-400 mt-1">支持图片、PDF、Word、TXT等格式</p>
        </div>
        
        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*,.pdf,.doc,.docx,.txt" 
          multiple 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
    </div>
  );
}

// 旧版图片上传组件（保留兼容性）
function ImageUploader({ images = [], onChange }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onChange([...images, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onChange([...images, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };
  
  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };
  
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">图片附件</label>
      <div 
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex gap-2 flex-wrap p-3 rounded-lg border-2 border-dashed transition-all ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
      >
        {images.map((img, idx) => (
          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => handleRemove(idx)} className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={12} className="text-white" />
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()} 
          className={`w-20 h-20 rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors ${
            isDragging 
              ? 'border-blue-400 text-blue-500' 
              : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500'
          }`}
        >
          <ImagePlus size={20} />
          <span className="text-xs mt-1">添加</span>
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
      </div>
      {isDragging && (
        <p className="text-xs text-blue-500 mt-1">松开鼠标上传图片</p>
      )}
    </div>
  );
}

// 提醒弹窗组件
function ReminderModal({ isOpen, onClose, note }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  if (!isOpen || !note) return null;
  
  // 再次播放提醒声音
  const playSound = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playBeep = (frequency, startTime, duration) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      playBeep(880, now, 0.15);
      playBeep(880, now + 0.2, 0.15);
      playBeep(1100, now + 0.4, 0.3);
      
      setTimeout(() => setIsPlaying(false), 700);
    } catch (e) {
      setIsPlaying(false);
      console.error('播放声音失败:', e);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden animate-fadeIn shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <BellRing size={32} className="text-white animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-center">提醒时间到！</h2>
        </div>
        
        {/* 内容 */}
        <div className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{note.title}</h3>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Calendar size={16} />
              <span>{note.date}</span>
              <Clock size={16} className="ml-2" />
              <span>{note.reminderTime}</span>
            </div>
          </div>
          
          {note.note && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-gray-600 text-sm">{note.note}</p>
            </div>
          )}
          
          <div className="flex gap-3">
            {note.reminderSound && (
              <button
                onClick={playSound}
                disabled={isPlaying}
                className="flex-1 py-2.5 border border-amber-500 text-amber-600 rounded-lg font-medium hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
              >
                <Volume2 size={18} className={isPlaying ? 'animate-pulse' : ''} />
                再响一次
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// PIN验证弹窗
function PinModal({ isOpen, onClose, onSuccess, pin, setPin: setGlobalPin }) {
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(!pin);
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSettingPin) {
      if (step === 1) {
        if (inputPin.length >= 4) { setStep(2); setError(false); }
        else setError(true);
      } else {
        if (confirmPin === inputPin) { setGlobalPin(inputPin); onSuccess(); resetModal(); }
        else setError(true);
      }
    } else {
      if (inputPin === pin) { onSuccess(); resetModal(); }
      else { setError(true); setInputPin(''); }
    }
  };
  
  const resetModal = () => { setInputPin(''); setConfirmPin(''); setError(false); setStep(1); };
  const handleClose = () => { resetModal(); onClose(); };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              {isSettingPin ? <Shield size={20} className="text-violet-600" /> : <Lock size={20} className="text-violet-600" />}
            </div>
            <h2 className="text-lg font-semibold">
              {isSettingPin ? (step === 1 ? '设置 PIN 码' : '确认 PIN 码') : '身份验证'}
            </h2>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <p className="text-gray-600 text-sm mb-4">
            {isSettingPin ? (step === 1 ? '请设置一个至少4位的PIN码' : '请再次输入PIN码以确认') : '请输入PIN码查看私密内容'}
          </p>
          <div className="mb-4">
            <input 
              type="password" inputMode="numeric" pattern="[0-9]*"
              value={step === 1 ? inputPin : confirmPin}
              onChange={(e) => { const val = e.target.value.replace(/\D/g, ''); if (step === 1) setInputPin(val); else setConfirmPin(val); setError(false); }}
              className={`w-full px-4 py-3 text-center text-2xl tracking-widest border rounded-xl focus:outline-none focus:ring-2 ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-violet-500'}`}
              placeholder="••••" maxLength={8} autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle size={14} />{isSettingPin ? (step === 1 ? 'PIN码至少需要4位' : '两次输入不一致') : 'PIN码错误'}</p>}
          </div>
          <button type="submit" className="w-full bg-violet-500 text-white py-3 rounded-xl font-medium hover:bg-violet-600 transition-colors">
            {isSettingPin ? (step === 1 ? '下一步' : '确认设置') : '验证'}
          </button>
        </form>
      </div>
    </div>
  );
}

// 私密遮罩
function PrivateMask({ onUnlock }) {
  return (
    <div onClick={onUnlock} className="bg-gray-100 rounded-lg px-3 py-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors">
      <Lock size={20} className="text-gray-400 mb-1" />
      <span className="text-gray-500 text-xs">点击验证查看</span>
    </div>
  );
}

function NoteCard({ note, category, onEdit, onDelete, onUpdateStatus, onOpenDetail, pin, onSetPin }) {
  const Icon = getIconComponent(category.iconName);
  const colorClasses = getColorClasses(category.color);
  const isPrivate = note.isPrivate;
  
  // 点击卡片处理
  const handleCardClick = (e) => {
    // 如果点击的是按钮或链接，不触发详情
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('select')) {
      return;
    }
    onOpenDetail(note);
  };
  
  // 渲染卡片预览内容（简化版，私密内容显示遮罩）
  const renderPreview = () => {
    if (isPrivate) {
      return (
        <div className="bg-violet-50 rounded-lg px-3 py-4 flex flex-col items-center justify-center">
          <Lock size={20} className="text-violet-400 mb-1" />
          <span className="text-violet-500 text-xs">点击验证查看</span>
        </div>
      );
    }
    
    switch (category.noteType) {
      case 'password':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-500">账号</span>
              <span className="text-gray-700 font-mono truncate max-w-[150px]">{note.username}</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-500">密码</span>
              <span className="text-gray-700 font-mono">••••••••</span>
            </div>
          </div>
        );
      
      case 'link':
        return (
          <div className="bg-blue-50 rounded-lg px-3 py-2">
            <span className="text-blue-600 text-sm font-mono truncate block">{note.url}</span>
          </div>
        );
      
      case 'date':
        const days = getDaysRemaining(note.date);
        const isPast = days < 0;
        const isNear = days >= 0 && days <= 30;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">{note.date}</span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${isPast ? 'bg-gray-100 text-gray-500' : isNear ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {isPast ? `已过 ${Math.abs(days)} 天` : days === 0 ? '就是今天！' : `还剩 ${days} 天`}
              </span>
            </div>
            {/* 显示提醒时间 */}
            {note.hasReminder && note.reminderTime && (
              <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                <Bell size={12} />
                <span>提醒时间：{note.reminderTime.slice(0, 5)}</span>
                {note.reminderSound && <Volume2 size={12} />}
              </div>
            )}
          </div>
        );
      
      case 'expense':
        const statusConfig = EXPENSE_STATUS.find(s => s.id === note.status) || EXPENSE_STATUS[0];
        const StatusIcon = statusConfig.icon;
        return (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-800">¥{note.amount?.toLocaleString()}</span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${statusConfig.bg}`}>
                <StatusIcon size={12} className={statusConfig.color} />
                <span className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.name}</span>
              </div>
            </div>
            {note.purchaseDate && (
              <div className="text-xs text-gray-500">
                购买日期：{note.purchaseDate}
              </div>
            )}
          </div>
        );
      
      case 'membership':
        const memberStatus = getMembershipStatus(note.endDate);
        const memberStatusConfig = MEMBERSHIP_STATUS.find(s => s.id === memberStatus);
        const MemberStatusIcon = memberStatusConfig?.icon || CheckCircle2;
        const memberDays = getDaysRemaining(note.endDate);
        const memberType = MEMBERSHIP_TYPES.find(t => t.id === note.membershipType);
        return (
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{memberType?.name || '会员'} · ¥{note.price}/{memberType?.unit || '月'}</span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${memberStatusConfig?.bg}`}>
                <MemberStatusIcon size={12} className={memberStatusConfig?.color} />
                <span className={`text-xs font-medium ${memberStatusConfig?.color}`}>{memberStatusConfig?.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{note.startDate} ~ {note.endDate}</span>
              <span className={memberStatus === 'expired' ? 'text-gray-400' : memberStatus === 'expiring' ? 'text-orange-600 font-medium' : 'text-green-600'}>
                {memberStatus === 'expired' ? `已过期 ${Math.abs(memberDays)} 天` : `还剩 ${memberDays} 天`}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {note.autoRenew && (
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  <RefreshCw size={10} /> 自动续费
                </span>
              )}
              {note.hasReminder && (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  <Bell size={10} /> 提前{note.reminderDays || 3}天提醒
                </span>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-gray-700 text-sm line-clamp-2">{note.content}</p>
          </div>
        );
    }
  };
  
  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${colorClasses.bg} flex items-center justify-center relative`}>
            <Icon size={16} className={colorClasses.text} />
            {isPrivate && <div className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center"><Lock size={8} className="text-white" /></div>}
          </div>
          <h3 className="font-semibold text-gray-800">{note.title}</h3>
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onEdit(note)} className="p-1.5 rounded-md hover:bg-gray-100"><Edit3 size={14} className="text-gray-400" /></button>
          <button onClick={() => onDelete(note.id)} className="p-1.5 rounded-md hover:bg-red-50"><Trash2 size={14} className="text-gray-400 hover:text-red-500" /></button>
        </div>
      </div>
      {renderPreview()}
      {!isPrivate && note.note && category.noteType !== 'simple' && category.noteType !== 'expense' && (
        <p className="text-gray-500 text-xs mt-2 px-1 truncate">{note.note}</p>
      )}
    </div>
  );
}

// 便签详情弹窗
function NoteDetailModal({ isOpen, onClose, note, category, onUpdateStatus, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  if (!isOpen || !note || !category) return null;
  
  const Icon = getIconComponent(category.iconName);
  const colorClasses = getColorClasses(category.color);
  
  const handleImageClick = (idx) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };
  
  const handleLinkClick = (e, url) => {
    e.preventDefault();
    if (window.electronAPI) {
      window.electronAPI.openExternal(url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleEdit = () => {
    onClose();
    onEdit(note);
  };
  
  const handleDelete = () => {
    onDelete(note.id);
    onClose();
    setShowDeleteConfirm(false);
  };
  
  const renderDetailContent = () => {
    switch (category.noteType) {
      case 'password':
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-500">账号</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-mono">{note.username}</span>
                <CopyButton text={note.username || ''} />
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-gray-500">密码</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-800 font-mono">{showPassword ? note.password : '••••••••'}</span>
                <button onClick={() => setShowPassword(!showPassword)} className="p-1.5 rounded-md hover:bg-gray-200 transition-colors">
                  {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                </button>
                <CopyButton text={note.password || ''} />
              </div>
            </div>
          </div>
        );
      
      case 'link':
        return (
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between">
                <a 
                  href={note.url} 
                  onClick={(e) => handleLinkClick(e, note.url)}
                  className="text-blue-600 hover:text-blue-700 font-mono break-all"
                >
                  {note.url}
                </a>
                <CopyButton text={note.url || ''} />
              </div>
            </div>
            <button
              onClick={(e) => handleLinkClick(e, note.url)}
              className="w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Globe size={16} />
              打开链接
            </button>
          </div>
        );
      
      case 'date':
        const days = getDaysRemaining(note.date);
        const isPast = days < 0;
        const isNear = days >= 0 && days <= 30;
        return (
          <div className="space-y-4">
            <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className={`text-5xl font-bold mb-2 ${isPast ? 'text-gray-400' : isNear ? 'text-red-500' : 'text-green-500'}`}>
                {Math.abs(days)}
              </div>
              <div className="text-gray-500">
                {isPast ? '天前已过期' : days === 0 ? '就是今天！' : '天后到期'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between">
              <span className="text-gray-500">目标日期</span>
              <span className="text-gray-800 font-medium">{note.date}</span>
            </div>
            {note.hasReminder && (
              <div className="bg-amber-50 rounded-lg px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {note.reminderSound ? <BellRing size={16} className="text-amber-600" /> : <BellOff size={16} className="text-amber-500" />}
                    <span className="text-amber-700 font-medium">提醒时间</span>
                  </div>
                  <span className="text-amber-800">{formatTime(note.reminderTime)}</span>
                </div>
                <div className="text-amber-600 text-sm mt-1">
                  {note.reminderSound ? '有声提醒' : '静音提醒'}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'expense':
        const statusConfig = EXPENSE_STATUS.find(s => s.id === note.status) || EXPENSE_STATUS[0];
        const StatusIcon = statusConfig.icon;
        return (
          <div className="space-y-4">
            <div className="text-center py-6 bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl">
              <div className="text-4xl font-bold text-emerald-600 mb-1">
                ¥{note.amount?.toLocaleString()}
              </div>
              <div className="text-emerald-500 text-sm">消费金额</div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">报销状态</span>
              <div className="relative">
                <select 
                  value={note.status} 
                  onChange={(e) => onUpdateStatus(note.id, e.target.value)}
                  className={`appearance-none pl-8 pr-4 py-2 rounded-full text-sm font-medium cursor-pointer focus:outline-none ${statusConfig.bg} ${statusConfig.color}`}
                >
                  {EXPENSE_STATUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <StatusIcon size={16} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${statusConfig.color}`} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">购买日期</span>
                <span className="text-gray-800">{note.purchaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">支付方式</span>
                <span className="text-gray-800">{note.paymentMethod}</span>
              </div>
              {note.paymentInfo && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 shrink-0">支付信息</span>
                  <span className="text-gray-800 text-right ml-4">{note.paymentInfo}</span>
                </div>
              )}
              {note.invoiceInfo && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-500 shrink-0">发票信息</span>
                  <span className="text-gray-800 text-right ml-4">{note.invoiceInfo}</span>
                </div>
              )}
            </div>
            {note.images && note.images.length > 0 && (
              <div>
                <div className="text-gray-600 text-sm mb-2">附件图片</div>
                <div className="flex gap-2 flex-wrap">
                  {note.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleImageClick(idx)} 
                      className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {note.files && note.files.length > 0 && (
              <div>
                <div className="text-gray-600 text-sm mb-2">附件文件</div>
                <div className="space-y-2">
                  {note.files.map((file, idx) => {
                    const FileIcon = getFileIcon(file.name);
                    return (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group">
                        <FileIcon size={20} className="text-gray-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(file.size)} · {getFileTypeLabel(file.name)}</p>
                        </div>
                        <a 
                          href={file.data} 
                          download={file.name}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="下载"
                        >
                          <Download size={14} className="text-gray-500" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      
      case 'membership':
        const memberStatus = getMembershipStatus(note.endDate);
        const memberStatusConfig = MEMBERSHIP_STATUS.find(s => s.id === memberStatus);
        const MemberStatusIcon = memberStatusConfig?.icon || CheckCircle2;
        const memberDays = getDaysRemaining(note.endDate);
        const memberType = MEMBERSHIP_TYPES.find(t => t.id === note.membershipType);
        const totalCost = calculateMembershipTotalCost(note);
        
        return (
          <div className="space-y-4">
            {/* 状态和剩余天数 */}
            <div className="text-center py-6 bg-gradient-to-br from-violet-50 to-purple-100 rounded-xl">
              <div className={`text-5xl font-bold mb-2 ${
                memberStatus === 'expired' ? 'text-gray-400' : 
                memberStatus === 'expiring' ? 'text-orange-500' : 'text-violet-600'
              }`}>
                {Math.abs(memberDays)}
              </div>
              <div className="text-gray-500">
                {memberStatus === 'expired' ? '天前已过期' : memberDays === 0 ? '今天到期！' : '天后到期'}
              </div>
              <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full ${memberStatusConfig?.bg}`}>
                <MemberStatusIcon size={14} className={memberStatusConfig?.color} />
                <span className={`text-sm font-medium ${memberStatusConfig?.color}`}>{memberStatusConfig?.name}</span>
              </div>
            </div>
            
            {/* 价格信息 */}
            <div className="bg-violet-50 rounded-lg px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="text-violet-600">单价</span>
                <span className="text-violet-800 font-bold text-lg">¥{note.price || 0}/{memberType?.unit || '月'}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-violet-100">
                <span className="text-violet-600">累计花费</span>
                <span className="text-violet-800 font-bold">¥{totalCost.toLocaleString()}</span>
              </div>
            </div>
            
            {/* 会员信息 */}
            <div className="space-y-2">
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between">
                <span className="text-gray-500">会员类型</span>
                <span className="text-gray-800 font-medium">{memberType?.name || '未知'}</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between">
                <span className="text-gray-500">开始日期</span>
                <span className="text-gray-800 font-medium">{note.startDate}</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-3 flex justify-between">
                <span className="text-gray-500">到期日期</span>
                <span className="text-gray-800 font-medium">{note.endDate}</span>
              </div>
            </div>
            
            {/* 自动续费标记 */}
            {note.autoRenew && (
              <div className="bg-blue-50 rounded-lg px-4 py-3 flex items-center gap-2">
                <RefreshCw size={16} className="text-blue-600" />
                <span className="text-blue-700 font-medium">已开启自动续费</span>
              </div>
            )}
            
            {/* 提醒设置 */}
            {note.hasReminder && (
              <div className="bg-amber-50 rounded-lg px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {note.reminderSound ? <BellRing size={16} className="text-amber-600" /> : <BellOff size={16} className="text-amber-500" />}
                    <span className="text-amber-700 font-medium">到期提醒</span>
                  </div>
                  <span className="text-amber-800">提前 {note.reminderDays || 3} 天</span>
                </div>
                <div className="text-amber-600 text-sm mt-1">
                  提醒时间：{note.reminderTime?.slice(0, 5) || '09:00'} · {note.reminderSound ? '有声提醒' : '静音提醒'}
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
            </div>
            {note.images && note.images.length > 0 && (
              <div>
                <div className="text-gray-600 text-sm mb-2">附件图片</div>
                <div className="flex gap-2 flex-wrap">
                  {note.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleImageClick(idx)} 
                      className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border border-gray-200"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {note.files && note.files.length > 0 && (
              <div>
                <div className="text-gray-600 text-sm mb-2">附件文件</div>
                <div className="space-y-2">
                  {note.files.map((file, idx) => {
                    const FileIcon = getFileIcon(file.name);
                    return (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group">
                        <FileIcon size={20} className="text-gray-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">{file.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(file.size)} · {getFileTypeLabel(file.name)}</p>
                        </div>
                        <a 
                          href={file.data} 
                          download={file.name}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="下载"
                        >
                          <Download size={14} className="text-gray-500" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
    }
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div 
          className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col overflow-hidden animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${colorClasses.bg} flex items-center justify-center`}>
                <Icon size={20} className={colorClasses.text} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{note.title}</h2>
                <p className="text-sm text-gray-500">{category.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleEdit} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="编辑"
              >
                <Edit3 size={18} className="text-gray-500" />
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)} 
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title="删除"
              >
                <Trash2 size={18} className="text-gray-500 hover:text-red-500" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderDetailContent()}
            
            {/* 备注 */}
            {note.note && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="text-gray-500 text-sm mb-1">备注</div>
                <p className="text-gray-700">{note.note}</p>
              </div>
            )}
          </div>
          
          {/* 私密标识 */}
          {note.isPrivate && (
            <div className="px-6 py-3 bg-violet-50 border-t border-violet-100 flex items-center justify-center gap-2">
              <Shield size={14} className="text-violet-500" />
              <span className="text-violet-600 text-sm">此便签为私密内容，关闭后需重新验证</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">确认删除</h3>
              <p className="text-gray-500 text-sm mt-1">确定要删除「{note.title}」吗？此操作无法撤销。</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
      
      {viewerOpen && (
        <ImageViewer 
          images={note.images || []} 
          initialIndex={viewerIndex} 
          onClose={() => setViewerOpen(false)} 
        />
      )}
    </>
  );
}

// PIN 验证弹窗（用于私密便签）
function PrivatePinModal({ isOpen, onClose, onSuccess, pin, setPin: setGlobalPin, currentUser }) {
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(!pin);
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1);
  
  // 忘记PIN码 - 密码重置模式
  const [isResettingPin, setIsResettingPin] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  // 当弹窗打开或pin变化时，更新isSettingPin状态
  useEffect(() => {
    if (isOpen) {
      setIsSettingPin(!pin);
      setInputPin('');
      setConfirmPin('');
      setStep(1);
      setError(false);
      setErrorMessage('');
      setIsResettingPin(false);
      setResetPassword('');
    }
  }, [isOpen, pin]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage('');
    
    if (isResettingPin) {
      // 验证账户密码来重置PIN
      if (resetPassword === currentUser?.password) {
        // 密码正确，进入设置新PIN模式
        setIsResettingPin(false);
        setIsSettingPin(true);
        setStep(1);
        setResetPassword('');
        setInputPin('');
      } else {
        setError(true);
        setErrorMessage('账户密码错误');
      }
      return;
    }
    
    if (isSettingPin) {
      if (step === 1) {
        if (inputPin.length >= 4) { 
          setStep(2); 
          setError(false); 
        } else {
          setError(true);
          setErrorMessage('PIN码至少4位');
        }
      } else {
        if (confirmPin === inputPin) { 
          setGlobalPin(inputPin); 
          onSuccess(); 
          resetModal(); 
        } else {
          setError(true);
          setErrorMessage('两次输入不一致');
        }
      }
    } else {
      if (inputPin === pin) { 
        onSuccess(); 
        resetModal(); 
      } else { 
        setError(true); 
        setErrorMessage('PIN码错误，请重试');
        setInputPin(''); 
      }
    }
  };
  
  const resetModal = () => {
    setInputPin('');
    setConfirmPin('');
    setStep(1);
    setError(false);
    setErrorMessage('');
    setIsResettingPin(false);
    setResetPassword('');
    setShowResetPassword(false);
  };
  
  const handleClose = () => {
    resetModal();
    onClose();
  };
  
  const handleForgotPin = () => {
    setIsResettingPin(true);
    setError(false);
    setErrorMessage('');
    setInputPin('');
  };
  
  const handleBackToPin = () => {
    setIsResettingPin(false);
    setResetPassword('');
    setError(false);
    setErrorMessage('');
  };
  
  if (!isOpen) return null;
  
  // 忘记PIN码 - 密码验证界面
  if (isResettingPin) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[55]" onClick={handleClose}>
        <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Key size={28} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">重置 PIN 码</h3>
            <p className="text-gray-500 text-sm mt-1">请输入账户密码验证身份</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <input
                type={showResetPassword ? 'text' : 'password'}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="请输入账户密码"
                autoFocus
                className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-amber-500'}`}
              />
              <button
                type="button"
                onClick={() => setShowResetPassword(!showResetPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showResetPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}
            <button type="submit" className="w-full mt-4 bg-amber-500 text-white py-3 rounded-xl font-medium hover:bg-amber-600 transition-colors">
              验证并重置
            </button>
            <button type="button" onClick={handleBackToPin} className="w-full mt-2 text-gray-500 py-2 hover:text-gray-700 transition-colors">
              返回 PIN 验证
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[55]" onClick={handleClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock size={28} className="text-violet-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {isSettingPin ? (step === 1 ? '设置 PIN 码' : '确认 PIN 码') : '验证 PIN 码'}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            {isSettingPin ? (step === 1 ? '首次使用，请设置4位以上数字PIN码' : '请再次输入以确认') : '请输入 PIN 码查看私密内容'}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            value={step === 2 ? confirmPin : inputPin}
            onChange={(e) => step === 2 ? setConfirmPin(e.target.value) : setInputPin(e.target.value)}
            placeholder="••••"
            autoFocus
            className={`w-full text-center text-2xl tracking-[0.5em] py-4 border rounded-xl focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-gray-200 focus:ring-violet-500'}`}
          />
          {error && <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>}
          <button type="submit" className="w-full mt-4 bg-violet-500 text-white py-3 rounded-xl font-medium hover:bg-violet-600 transition-colors">
            {isSettingPin ? (step === 1 ? '下一步' : '确认设置') : '验证'}
          </button>
          {/* 忘记PIN码按钮 - 仅在验证模式下显示 */}
          {!isSettingPin && pin && (
            <button 
              type="button" 
              onClick={handleForgotPin} 
              className="w-full mt-2 text-amber-600 py-2 hover:text-amber-700 transition-colors text-sm"
            >
              忘记 PIN 码？使用密码重置
            </button>
          )}
          <button type="button" onClick={handleClose} className="w-full mt-2 text-gray-500 py-2 hover:text-gray-700 transition-colors">
            取消
          </button>
        </form>
      </div>
    </div>
  );
}

// 个人主页弹窗
function ProfileModal({ isOpen, onClose, currentUser, userAvatar, onChangeAvatar, onLogout, onDeleteAccount }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        {/* 顶部背景 */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
          
          {/* 头像 */}
          <div 
            className="relative inline-block cursor-pointer group"
            onClick={onChangeAvatar}
          >
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt="头像" 
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
                <User size={32} className="text-white" />
              </div>
            )}
            {/* 编辑图标 */}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
              <Camera size={14} className="text-gray-600" />
            </div>
          </div>
          
          <h2 className="text-white text-xl font-bold mt-3">{currentUser?.username}</h2>
          <p className="text-white/70 text-sm mt-1">点击头像更换</p>
        </div>
        
        {/* 菜单选项 */}
        <div className="p-4 space-y-2">
          {/* 退出登录 */}
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <LogOut size={18} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">退出登录</p>
              <p className="text-xs text-gray-500">切换到其他账号</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          
          {/* 分隔线 */}
          <div className="h-px bg-gray-100 my-2" />
          
          {/* 注销账号 */}
          <button
            onClick={() => { onDeleteAccount(); onClose(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-red-600">注销账号</p>
              <p className="text-xs text-gray-500">永久删除账号和所有数据</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
        
        {/* 底部版本信息 */}
        <div className="px-4 pb-4 text-center">
          <p className="text-xs text-gray-400">糖糖便签 v1.0.0</p>
        </div>
      </div>
    </div>
  );
}

// 账号注销弹窗
function DeleteAccountModal({ isOpen, onClose, onConfirm, currentUser }) {
  const [step, setStep] = useState(1); // 1: 输入密码, 2: 确认删除
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const handleVerifyPassword = (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== currentUser?.password) {
      setError('密码错误');
      return;
    }
    
    setStep(2);
  };
  
  const handleConfirmDelete = () => {
    onConfirm();
    handleClose();
  };
  
  const handleClose = () => {
    setStep(1);
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 p-6 animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">注销账号</h3>
              <p className="text-gray-500 text-sm mt-1">请输入密码以验证身份</p>
            </div>
            <form onSubmit={handleVerifyPassword}>
              <div className="relative mb-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入账户密码"
                  autoFocus
                  className={`w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-red-500'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
              <button type="submit" className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
                验证密码
              </button>
              <button type="button" onClick={handleClose} className="w-full mt-2 text-gray-500 py-2 hover:text-gray-700 transition-colors">
                取消
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={28} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">确认注销</h3>
              <p className="text-gray-500 text-sm mt-2">
                你确定要注销账号 <span className="font-medium text-gray-700">{currentUser?.username}</span> 吗？
              </p>
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-red-600 text-sm">⚠️ 所有便签、分类和设置都将被永久删除，此操作无法撤销！</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                确认注销
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 头像裁剪弹窗
function AvatarCropModal({ isOpen, onClose, imageData, onConfirm }) {
  const canvasRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  
  const cropSize = 200; // 裁剪框大小
  const containerSize = 280; // 容器大小
  
  // 加载图片
  useEffect(() => {
    if (!imageData || !isOpen) return;
    
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageSize({ width: img.width, height: img.height });
      
      // 计算初始缩放，让图片填满裁剪框
      const minScale = cropSize / Math.min(img.width, img.height);
      setScale(Math.max(minScale, 1));
      setPosition({ x: 0, y: 0 });
      setImageLoaded(true);
    };
    img.src = imageData;
    
    return () => {
      setImageLoaded(false);
    };
  }, [imageData, isOpen]);
  
  // 鼠标/触摸事件处理
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - position.x, y: clientY - position.y });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;
    
    // 限制拖动范围
    const scaledWidth = imageSize.width * scale;
    const scaledHeight = imageSize.height * scale;
    const maxX = Math.max(0, (scaledWidth - cropSize) / 2);
    const maxY = Math.max(0, (scaledHeight - cropSize) / 2);
    
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, newX)),
      y: Math.max(-maxY, Math.min(maxY, newY))
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // 缩放处理
  const handleScaleChange = (newScale) => {
    const minScale = cropSize / Math.min(imageSize.width, imageSize.height);
    setScale(Math.max(minScale, Math.min(3, newScale)));
    
    // 调整位置以保持在范围内
    const scaledWidth = imageSize.width * newScale;
    const scaledHeight = imageSize.height * newScale;
    const maxX = Math.max(0, (scaledWidth - cropSize) / 2);
    const maxY = Math.max(0, (scaledHeight - cropSize) / 2);
    
    setPosition({
      x: Math.max(-maxX, Math.min(maxX, position.x)),
      y: Math.max(-maxY, Math.min(maxY, position.y))
    });
  };
  
  // 确认裁剪
  const handleConfirm = () => {
    if (!imageRef.current) return;
    
    const canvas = document.createElement('canvas');
    const outputSize = 128;
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    
    // 计算裁剪区域在原图上的位置
    const scaledWidth = imageSize.width * scale;
    const scaledHeight = imageSize.height * scale;
    
    // 图片中心点在容器中的位置
    const imgCenterX = containerSize / 2 + position.x;
    const imgCenterY = containerSize / 2 + position.y;
    
    // 裁剪框相对于图片的位置（图片坐标系）
    const cropX = (containerSize / 2 - cropSize / 2 - imgCenterX + scaledWidth / 2) / scale;
    const cropY = (containerSize / 2 - cropSize / 2 - imgCenterY + scaledHeight / 2) / scale;
    const cropW = cropSize / scale;
    const cropH = cropSize / scale;
    
    ctx.drawImage(
      imageRef.current,
      cropX, cropY, cropW, cropH,
      0, 0, outputSize, outputSize
    );
    
    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
    onConfirm(croppedBase64);
  };
  
  const handleClose = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
    setImageLoaded(false);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 overflow-hidden animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 text-center">裁剪头像</h3>
        </div>
        
        <div className="p-4">
          {/* 裁剪区域 */}
          <div 
            className="relative mx-auto bg-gray-900 overflow-hidden cursor-move"
            style={{ width: containerSize, height: containerSize }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            {/* 图片 */}
            {imageLoaded && (
              <div
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                  width: imageSize.width * scale,
                  height: imageSize.height * scale,
                }}
              >
                <img
                  src={imageData}
                  alt="待裁剪"
                  className="w-full h-full"
                  draggable={false}
                />
              </div>
            )}
            
            {/* 裁剪遮罩 */}
            <div className="absolute inset-0 pointer-events-none">
              {/* 上 */}
              <div className="absolute top-0 left-0 right-0 bg-black/50" style={{ height: (containerSize - cropSize) / 2 }} />
              {/* 下 */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50" style={{ height: (containerSize - cropSize) / 2 }} />
              {/* 左 */}
              <div className="absolute bg-black/50" style={{ top: (containerSize - cropSize) / 2, left: 0, width: (containerSize - cropSize) / 2, height: cropSize }} />
              {/* 右 */}
              <div className="absolute bg-black/50" style={{ top: (containerSize - cropSize) / 2, right: 0, width: (containerSize - cropSize) / 2, height: cropSize }} />
              {/* 裁剪框边框 */}
              <div 
                className="absolute border-2 border-white rounded-full"
                style={{
                  top: (containerSize - cropSize) / 2,
                  left: (containerSize - cropSize) / 2,
                  width: cropSize,
                  height: cropSize,
                }}
              />
            </div>
          </div>
          
          {/* 缩放滑块 */}
          <div className="mt-4 flex items-center gap-3 px-4">
            <span className="text-gray-400 text-sm">小</span>
            <input
              type="range"
              min={cropSize / Math.min(imageSize.width || 200, imageSize.height || 200)}
              max={3}
              step={0.01}
              value={scale}
              onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-gray-400 text-sm">大</span>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-3">拖动图片调整位置</p>
        </div>
        
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

// 类别管理弹窗
function CategoryModal({ isOpen, onClose, categories, onSave, onDelete, editingCategory }) {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('StickyNote');
  const [color, setColor] = useState('gray');
  const [noteType, setNoteType] = useState('simple');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  React.useEffect(() => {
    if (editingCategory) { 
      setName(editingCategory.name); 
      setIconName(editingCategory.iconName); 
      setColor(editingCategory.color); 
      setNoteType(editingCategory.noteType); 
    } else { 
      // 新建时使用默认类型的默认图标和颜色
      const defaultType = NOTE_TYPES[0];
      setName(''); 
      setIconName(defaultType.defaultIcon); 
      setColor(defaultType.defaultColor); 
      setNoteType(defaultType.id); 
    }
    setShowDeleteConfirm(false);
  }, [editingCategory, isOpen]);
  
  // 切换类型时自动更新图标和颜色（仅新建时）
  const handleNoteTypeChange = (typeId) => {
    setNoteType(typeId);
    // 只有新建类别时才自动更新图标和颜色
    if (!editingCategory) {
      const typeConfig = NOTE_TYPES.find(t => t.id === typeId);
      if (typeConfig) {
        setIconName(typeConfig.defaultIcon);
        setColor(typeConfig.defaultColor);
      }
    }
  };
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: editingCategory?.id || `cat_${Date.now()}`, name, iconName, color, noteType });
    onClose();
  };
  
  // 获取该类别下的便签数量
  const noteCount = editingCategory 
    ? categories.reduce((count, cat) => cat.id === editingCategory.id ? count : count, 0)
    : 0;
  
  const SelectedIcon = getIconComponent(iconName);
  const selectedColor = getColorClasses(color);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold">{editingCategory ? '编辑类别' : '新建类别'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {/* 删除确认界面 */}
          {showDeleteConfirm ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">确认删除类别？</h3>
              <p className="text-gray-600 mb-2">
                您确定要删除「<span className="font-medium">{editingCategory?.name}</span>」类别吗？
              </p>
              <p className="text-red-500 text-sm mb-6">
                ⚠️ 该类别下的所有便签都将被永久删除，此操作不可恢复！
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)} 
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  onClick={() => { onDelete(editingCategory.id); onClose(); }} 
                  className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                >
                  确认删除
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center py-4">
                <div className={`w-16 h-16 rounded-2xl ${selectedColor.bg} flex items-center justify-center`}><SelectedIcon size={32} className={selectedColor.text} /></div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">类别名称</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">便签类型</label>
                <div className="grid grid-cols-2 gap-2">
                  {NOTE_TYPES.map(type => (
                    <button key={type.id} type="button" onClick={() => handleNoteTypeChange(type.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${noteType === type.id ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="font-medium text-sm text-gray-800 flex items-center gap-1">{type.name}{type.defaultPrivate && <Lock size={12} className="text-violet-500" />}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">选择图标</label>
                <button type="button" onClick={() => setShowIconPicker(!showIconPicker)} className="w-full px-3 py-2 border border-gray-200 rounded-lg flex items-center justify-between hover:border-gray-300">
                  <div className="flex items-center gap-2"><SelectedIcon size={18} className="text-gray-600" /><span className="text-gray-700">{iconName}</span></div>
                  <span className="text-gray-400 text-sm">{showIconPicker ? '收起' : '展开'}</span>
                </button>
                {showIconPicker && (
                  <div className="mt-2 p-3 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-1">
                      {ICON_OPTIONS.map(({ name: iName, icon: IconComp }) => (
                        <button key={iName} type="button" onClick={() => { setIconName(iName); setShowIconPicker(false); }}
                          className={`p-2 rounded-lg transition-colors ${iconName === iName ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`} title={iName}>
                          <IconComp size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">选择颜色</label>
                <div className="grid grid-cols-9 gap-2">
                  {COLOR_OPTIONS.map(c => (
                    <button key={c.name} type="button" onClick={() => setColor(c.name)}
                      className={`w-8 h-8 rounded-full ${c.bg} ${c.text} flex items-center justify-center transition-all ${color === c.name ? 'ring-2 ring-offset-2 ' + c.ring : ''}`}>
                      {color === c.name && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                {editingCategory && (
                  <button 
                    type="button" 
                    onClick={() => setShowDeleteConfirm(true)} 
                    className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    删除
                  </button>
                )}
                <button type="submit" className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors">保存</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// 便签弹窗
function NoteModal({ isOpen, onClose, onSave, editingNote, categories, defaultCategoryId }) {
  const [categoryId, setCategoryId] = useState('');
  const [formData, setFormData] = useState({});
  const [isPrivate, setIsPrivate] = useState(false);
  
  const selectedCategory = categories.find(c => c.id === categoryId);
  const noteTypeConfig = NOTE_TYPES.find(t => t.id === selectedCategory?.noteType);
  
  React.useEffect(() => {
    if (editingNote) {
      setCategoryId(editingNote.categoryId);
      setFormData(editingNote);
      setIsPrivate(editingNote.isPrivate ?? false);
    } else {
      // 如果有指定默认类别且存在于列表中，使用它；否则使用第一个类别
      const targetCat = defaultCategoryId && categories.find(c => c.id === defaultCategoryId);
      const initialCat = targetCat || categories[0];
      setCategoryId(initialCat?.id || '');
      
      // 基础表单数据
      const baseFormData = { images: [], files: [], hasReminder: false, reminderTime: '09:00:00', reminderSound: true };
      
      // 如果是报销记录类型，设置默认日期和金额
      if (initialCat?.noteType === 'expense') {
        const today = new Date().toISOString().split('T')[0];
        baseFormData.purchaseDate = today;
        baseFormData.amount = 0;
      }
      
      // 如果是会员管理类型，设置默认日期
      if (initialCat?.noteType === 'membership') {
        const today = new Date();
        const startDate = today.toISOString().split('T')[0];
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 30); // 默认连续包月30天
        baseFormData.membershipType = 'monthly_auto';
        baseFormData.startDate = startDate;
        baseFormData.endDate = endDate.toISOString().split('T')[0];
        baseFormData.reminderDays = 3;
        baseFormData.reminderSound = true;
      }
      
      setFormData(baseFormData);
      const noteType = NOTE_TYPES.find(t => t.id === initialCat?.noteType);
      setIsPrivate(noteType?.defaultPrivate ?? false);
    }
  }, [editingNote, isOpen, categories, defaultCategoryId]);
  
  // 当切换类别时，如果是会员管理，也要设置默认日期
  React.useEffect(() => {
    if (!editingNote && selectedCategory?.noteType === 'membership' && !formData.startDate) {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0];
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        membershipType: prev.membershipType || 'monthly_auto',
        startDate: startDate,
        endDate: endDate.toISOString().split('T')[0],
        reminderDays: prev.reminderDays || 3,
        reminderSound: prev.reminderSound ?? true
      }));
    }
  }, [selectedCategory, editingNote]);
  
  // 当切换类别时，如果是报销记录，设置默认日期和金额
  React.useEffect(() => {
    if (!editingNote && selectedCategory?.noteType === 'expense' && !formData.purchaseDate) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        purchaseDate: today,
        amount: prev.amount ?? 0
      }));
    }
  }, [selectedCategory, editingNote]);
  
  React.useEffect(() => {
    if (!editingNote && selectedCategory) {
      const noteType = NOTE_TYPES.find(t => t.id === selectedCategory.noteType);
      setIsPrivate(noteType?.defaultPrivate ?? false);
    }
  }, [categoryId, editingNote, selectedCategory]);
  
  if (!isOpen) return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // 确保报销记录有默认状态
    const noteData = { ...formData, categoryId, isPrivate, id: editingNote?.id || Date.now() };
    if (selectedCategory?.noteType === 'expense' && !noteData.status) {
      noteData.status = 'not_invoiced'; // 默认为"未开票"
    }
    onSave(noteData);
    onClose();
  };
  
  const renderFields = () => {
    if (!selectedCategory) return null;
    switch (selectedCategory.noteType) {
      case 'password':
        return (
          <>
            <div><label className="block text-sm text-gray-600 mb-1">账号</label><input type="text" value={formData.username || ''} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">密码</label><input type="text" value={formData.password || ''} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          </>
        );
      case 'link':
        return <div><label className="block text-sm text-gray-600 mb-1">网址</label><input type="url" value={formData.url || ''} onChange={(e) => setFormData({...formData, url: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://" /></div>;
      case 'date':
        // 检查日期是否是过去
        const today = new Date().toISOString().split('T')[0];
        const selectedDate = formData.date || '';
        const isPastDate = selectedDate && selectedDate < today;
        const isToday = selectedDate === today;
        
        // 获取当前时间（用于限制今天的提醒时间）
        const now = new Date();
        const currentTimeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
        
        // 检查提醒时间是否已过（仅对今天有效）
        const reminderTime = formData.reminderTime || '09:00:00';
        const isReminderTimePast = isToday && reminderTime <= currentTimeStr;
        
        // 如果日期是过去或今天的提醒时间已过，应该禁用提醒
        const shouldDisableReminder = isPastDate || isReminderTimePast;
        
        // 处理日期变化
        const handleDateChange = (e) => {
          const newDate = e.target.value;
          const newIsPast = newDate && newDate < today;
          
          // 如果改成过去的日期，自动关闭提醒
          if (newIsPast && formData.hasReminder) {
            setFormData({...formData, date: newDate, hasReminder: false});
          } else {
            setFormData({...formData, date: newDate});
          }
        };
        
        // 处理提醒开关变化
        const handleReminderToggle = () => {
          if (!formData.hasReminder) {
            // 开启提醒时，如果是今天且当前时间已过默认提醒时间，设置一个合理的未来时间
            if (isToday) {
              const futureTime = new Date(now.getTime() + 5 * 60000); // 5分钟后
              const futureTimeStr = futureTime.toTimeString().split(' ')[0];
              setFormData({...formData, hasReminder: true, reminderTime: futureTimeStr});
            } else {
              setFormData({...formData, hasReminder: true});
            }
          } else {
            setFormData({...formData, hasReminder: false});
          }
        };
        
        // 处理提醒时间变化
        const handleReminderTimeChange = (e) => {
          const newTime = e.target.value;
          // 如果是今天，检查时间是否有效
          if (isToday && newTime <= currentTimeStr) {
            // 时间已过，不更新并给出提示（通过 UI 显示）
            return;
          }
          setFormData({...formData, reminderTime: newTime});
        };
        
        // 计算今天可选的最小时间（当前时间往后1分钟）
        const minTime = isToday ? currentTimeStr : undefined;
        
        return (
          <>
            <div>
              <label className="block text-sm text-gray-600 mb-1">日期</label>
              <input type="date" value={formData.date || ''} onChange={handleDateChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className={`p-4 rounded-xl border space-y-3 ${isPastDate ? 'bg-gray-50 border-gray-200' : 'bg-amber-50 border-amber-100'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className={isPastDate ? 'text-gray-400' : 'text-amber-600'} />
                  <span className={`text-sm font-medium ${isPastDate ? 'text-gray-500' : 'text-amber-800'}`}>启用提醒</span>
                  {isPastDate && <span className="text-xs text-gray-400">(已过期)</span>}
                </div>
                <button 
                  type="button" 
                  onClick={handleReminderToggle}
                  disabled={isPastDate}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    isPastDate 
                      ? 'bg-gray-200 cursor-not-allowed' 
                      : formData.hasReminder 
                        ? 'bg-amber-500' 
                        : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.hasReminder && !isPastDate ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              {formData.hasReminder && !isPastDate && (
                <>
                  <div>
                    <label className="block text-xs text-amber-700 mb-1">
                      提醒时间
                      {isToday && <span className="text-amber-500 ml-1">(需晚于当前时间 {currentTimeStr.slice(0,5)})</span>}
                    </label>
                    <input 
                      type="time" 
                      step="1" 
                      value={formData.reminderTime || '09:00:00'} 
                      onChange={handleReminderTimeChange} 
                      min={minTime}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 bg-white text-sm ${
                        isReminderTimePast 
                          ? 'border-red-300 focus:ring-red-500 text-red-600' 
                          : 'border-amber-200 focus:ring-amber-500'
                      }`} 
                    />
                    {isReminderTimePast && (
                      <p className="text-xs text-red-500 mt-1">提醒时间已过，请选择更晚的时间</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {formData.reminderSound ? <Volume2 size={14} className="text-amber-600" /> : <VolumeX size={14} className="text-amber-500" />}
                      <span className="text-xs text-amber-700">{formData.reminderSound ? '有声提醒' : '静音提醒'}</span>
                    </div>
                    <button type="button" onClick={() => setFormData({...formData, reminderSound: !formData.reminderSound})}
                      className={`w-9 h-5 rounded-full transition-colors relative ${formData.reminderSound ? 'bg-amber-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.reminderSound ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        );
      case 'expense':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm text-gray-600 mb-1">金额</label><input type="number" value={formData.amount || ''} onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" /></div>
              <div><label className="block text-sm text-gray-600 mb-1">购买日期</label><input type="date" value={formData.purchaseDate || ''} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <div><label className="block text-sm text-gray-600 mb-1">支付方式</label><input type="text" value={formData.paymentMethod || ''} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="支付宝/微信/银行卡..." /></div>
            <div><label className="block text-sm text-gray-600 mb-1">支付信息</label><input type="text" value={formData.paymentInfo || ''} onChange={(e) => setFormData({...formData, paymentInfo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="订单号、商户等" /></div>
            <div><label className="block text-sm text-gray-600 mb-1">发票信息</label><input type="text" value={formData.invoiceInfo || ''} onChange={(e) => setFormData({...formData, invoiceInfo: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="发票号码等" /></div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">报销状态</label>
              <select value={formData.status || 'not_invoiced'} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {EXPENSE_STATUS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <AttachmentUploader 
              images={formData.images || []} 
              files={formData.files || []}
              onImagesChange={(images) => setFormData({...formData, images})}
              onFilesChange={(files) => setFormData({...formData, files})}
            />
          </>
        );
      case 'membership':
        // 计算到期日期
        const calcEndDate = (startDate, typeId, customDays) => {
          if (!startDate) return '';
          const start = new Date(startDate);
          const type = MEMBERSHIP_TYPES.find(t => t.id === typeId);
          const days = type?.id === 'custom' ? (customDays || 30) : (type?.days || 30);
          start.setDate(start.getDate() + days);
          return start.toISOString().split('T')[0];
        };
        
        // 处理会员类型变化
        const handleMembershipTypeChange = (typeId) => {
          const newEndDate = calcEndDate(formData.startDate || new Date().toISOString().split('T')[0], typeId, formData.customDays);
          setFormData({...formData, membershipType: typeId, endDate: newEndDate});
        };
        
        // 处理开始日期变化
        const handleStartDateChange = (date) => {
          const newEndDate = calcEndDate(date, formData.membershipType || 'monthly_auto', formData.customDays);
          setFormData({...formData, startDate: date, endDate: newEndDate});
        };
        
        // 处理自定义天数变化
        const handleCustomDaysChange = (days) => {
          const newEndDate = calcEndDate(formData.startDate, 'custom', days);
          setFormData({...formData, customDays: days, endDate: newEndDate});
        };
        
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">会员类型</label>
                <select 
                  value={formData.membershipType || 'monthly_auto'} 
                  onChange={(e) => handleMembershipTypeChange(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MEMBERSHIP_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">单价（元）</label>
                <input 
                  type="number" 
                  value={formData.price || ''} 
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="0.00" 
                />
              </div>
            </div>
            
            {formData.membershipType === 'custom' && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">自定义天数</label>
                <input 
                  type="number" 
                  value={formData.customDays || 30} 
                  onChange={(e) => handleCustomDaysChange(parseInt(e.target.value) || 30)} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  min="1"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">开始日期</label>
                <input 
                  type="date" 
                  value={formData.startDate || new Date().toISOString().split('T')[0]} 
                  onChange={(e) => handleStartDateChange(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">到期日期</label>
                <input 
                  type="date" 
                  value={formData.endDate || ''} 
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    // 验证到期日期不能早于开始日期
                    const startDate = formData.startDate || new Date().toISOString().split('T')[0];
                    if (e.target.value < startDate) {
                      return; // 不允许设置早于开始日期的到期日期
                    }
                    setFormData({...formData, endDate: e.target.value});
                  }} 
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    formData.endDate && formData.startDate && formData.endDate < formData.startDate
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-200 focus:ring-blue-500'
                  }`} 
                />
                {formData.endDate && formData.startDate && formData.endDate < formData.startDate && (
                  <p className="text-xs text-red-500 mt-1">到期日期不能早于开始日期</p>
                )}
              </div>
            </div>
            
            {/* 自动续费开关 */}
            <div className="flex items-center justify-between py-2 px-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-blue-600" />
                <span className="text-sm text-blue-700">自动续费</span>
              </div>
              <button 
                type="button" 
                onClick={() => setFormData({...formData, autoRenew: !formData.autoRenew})} 
                className={`w-11 h-6 rounded-full transition-colors relative ${formData.autoRenew ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.autoRenew ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            
            {/* 到期提醒设置 */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">到期提醒</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFormData({...formData, hasReminder: !formData.hasReminder})}
                  className={`w-11 h-6 rounded-full transition-colors relative ${formData.hasReminder ? 'bg-amber-500' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.hasReminder ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              {formData.hasReminder && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-amber-700 mb-1">提前几天提醒</label>
                      <input 
                        type="number" 
                        value={formData.reminderDays || 3} 
                        onChange={(e) => setFormData({...formData, reminderDays: parseInt(e.target.value) || 3})} 
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm" 
                        min="1"
                        max="30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-amber-700 mb-1">提醒时间</label>
                      <input 
                        type="time" 
                        value={formData.reminderTime || '09:00'} 
                        onChange={(e) => setFormData({...formData, reminderTime: e.target.value})} 
                        className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {formData.reminderSound ? <Volume2 size={14} className="text-amber-600" /> : <VolumeX size={14} className="text-amber-500" />}
                      <span className="text-xs text-amber-700">{formData.reminderSound ? '有声提醒' : '静音提醒'}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, reminderSound: !formData.reminderSound})}
                      className={`w-9 h-5 rounded-full transition-colors relative ${formData.reminderSound ? 'bg-amber-500' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${formData.reminderSound ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        );
      default:
        return (
          <>
            <div><label className="block text-sm text-gray-600 mb-1">内容</label><textarea value={formData.content || ''} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            <AttachmentUploader 
              images={formData.images || []} 
              files={formData.files || []}
              onImagesChange={(images) => setFormData({...formData, images})}
              onFilesChange={(files) => setFormData({...formData, files})}
            />
          </>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-semibold">{editingNote ? '编辑便签' : '新建便签'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} className="text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">类别</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><label className="block text-sm text-gray-600 mb-1">标题</label><input type="text" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required /></div>
            {renderFields()}
            {selectedCategory?.noteType !== 'expense' && (
              <div><label className="block text-sm text-gray-600 mb-1">备注</label><input type="text" value={formData.note || ''} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            )}
            <div className="flex items-center justify-between py-2 px-3 bg-violet-50 rounded-lg">
              <div className="flex items-center gap-2"><Lock size={16} className="text-violet-600" /><span className="text-sm text-violet-700">设为私密</span></div>
              <button type="button" onClick={() => setIsPrivate(!isPrivate)} className={`w-11 h-6 rounded-full transition-colors relative ${isPrivate ? 'bg-violet-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${isPrivate ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors">保存</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// 报销统计组件
function ExpenseStats({ notes, categories }) {
  const expenseCategory = categories.find(c => c.noteType === 'expense');
  if (!expenseCategory) return null;
  
  const expenseNotes = notes.filter(n => n.categoryId === expenseCategory.id);
  if (expenseNotes.length === 0) return null;
  
  const stats = EXPENSE_STATUS.reduce((acc, status) => {
    const filtered = expenseNotes.filter(n => n.status === status.id);
    acc[status.id] = { count: filtered.length, amount: filtered.reduce((sum, n) => sum + (n.amount || 0), 0) };
    return acc;
  }, {});
  
  // 待报销金额包括：已申请未出票 + 未开发票 + 已开发票未报销
  const pendingAmount = (stats.applied?.amount || 0) + (stats.not_invoiced?.amount || 0) + (stats.invoiced?.amount || 0);
  
  if (pendingAmount === 0) return null;
  
  return (
    <div className="mb-4 p-3 bg-emerald-50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm text-emerald-700">待报销金额</span>
        <span className="text-lg font-bold text-emerald-700">¥{pendingAmount.toLocaleString()}</span>
      </div>
      <div className="flex gap-3 mt-2 text-xs flex-wrap">
        {stats.applied?.count > 0 && <span className="text-purple-600">{stats.applied.count}笔已申请</span>}
        {stats.not_invoiced?.count > 0 && <span className="text-orange-600">{stats.not_invoiced.count}笔未开票</span>}
        {stats.invoiced?.count > 0 && <span className="text-blue-600">{stats.invoiced.count}笔待报销</span>}
      </div>
    </div>
  );
}

// 会员统计组件
function MembershipStats({ notes, categories }) {
  const memberCategory = categories.find(c => c.noteType === 'membership');
  if (!memberCategory) return null;
  
  const memberNotes = notes.filter(n => n.categoryId === memberCategory.id);
  if (memberNotes.length === 0) return null;
  
  // 统计各状态数量
  const statusCounts = memberNotes.reduce((acc, note) => {
    const status = getMembershipStatus(note.endDate);
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
  
  // 计算本月支出（本月开始的会员）
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlyExpense = memberNotes
    .filter(n => n.startDate?.startsWith(thisMonth))
    .reduce((sum, n) => sum + (n.price || 0), 0);
  
  // 计算年度支出（今年开始的会员累计）
  const thisYear = String(now.getFullYear());
  const yearlyExpense = memberNotes
    .filter(n => n.startDate?.startsWith(thisYear))
    .reduce((sum, n) => sum + calculateMembershipTotalCost(n), 0);
  
  // 计算总累计花费
  const totalExpense = memberNotes.reduce((sum, n) => sum + calculateMembershipTotalCost(n), 0);
  
  return (
    <div className="mb-4 p-3 bg-violet-50 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-violet-700">会员支出</span>
        <span className="text-lg font-bold text-violet-700">¥{totalExpense.toLocaleString()}</span>
      </div>
      <div className="flex gap-4 text-xs text-violet-600 mb-2">
        <span>本月 ¥{monthlyExpense.toLocaleString()}</span>
        <span>年度 ¥{yearlyExpense.toLocaleString()}</span>
      </div>
      <div className="flex gap-3 text-xs flex-wrap">
        {statusCounts.active > 0 && <span className="text-green-600">{statusCounts.active}个生效中</span>}
        {statusCounts.expiring > 0 && <span className="text-orange-600">{statusCounts.expiring}个即将到期</span>}
        {statusCounts.expired > 0 && <span className="text-gray-500">{statusCounts.expired}个已过期</span>}
      </div>
    </div>
  );
}

// ==================== 数据持久化 Hook ====================

function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 检查是否在 Electron 环境中
        if (window.electronAPI) {
          const savedData = await window.electronAPI.loadData();
          if (savedData && savedData[key] !== undefined) {
            setState(savedData[key]);
          }
        } else {
          // 浏览器环境使用 localStorage
          const saved = localStorage.getItem(key);
          if (saved) {
            setState(JSON.parse(saved));
          }
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
      setIsLoaded(true);
    };
    loadData();
  }, [key]);
  
  return [state, setState, isLoaded];
}

// 保存所有数据的 Hook
function useSaveData(data, isLoaded) {
  const saveTimeoutRef = useRef(null);
  
  useEffect(() => {
    if (!isLoaded) return;
    
    // 防抖保存
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        if (window.electronAPI) {
          await window.electronAPI.saveData(data);
        } else {
          // 浏览器环境使用 localStorage
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
        }
      } catch (error) {
        console.error('保存数据失败:', error);
      }
    }, 500);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, isLoaded]);
}

// ==================== 主应用组件 ====================

export default function InfoNotesApp() {
  // 数据加载状态
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // 用户认证状态
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([
    // 预设一个测试用户
    { id: 1, username: '测试用户', password: 'Test123!', createdAt: '2024-01-01' }
  ]);
  
  // 记住账号功能
  const [savedAccounts, setSavedAccounts] = useState([]); // 已保存的账号列表
  
  // 应用状态
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [notes, setNotes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [pin, setPin] = useState(null);
  
  // 排序状态（用于报销记录和重要日期）
  const [sortBy, setSortBy] = useState('created'); // 'created' | 'date'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  
  // 筛选状态（存储选中的状态ID数组，'all' 表示全部）
  const [statusFilter, setStatusFilter] = useState(['all']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  
  // 详情视图状态
  const [detailNote, setDetailNote] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // 私密便签验证状态
  const [pendingPrivateNote, setPendingPrivateNote] = useState(null);
  const [isPrivatePinModalOpen, setIsPrivatePinModalOpen] = useState(false);
  
  // 账号注销状态
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  
  // 个人主页状态
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // 头像状态
  const [userAvatar, setUserAvatar] = useState(null);
  const avatarInputRef = useRef(null);
  const [avatarToCrop, setAvatarToCrop] = useState(null);
  const [isAvatarCropOpen, setIsAvatarCropOpen] = useState(false);
  
  // 窗口收缩状态
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapseSide, setCollapseSide] = useState('right');
  
  // 类别拖拽排序状态
  const [draggedCategory, setDraggedCategory] = useState(null);
  const [dragOverCategory, setDragOverCategory] = useState(null);
  
  // 监听窗口收缩状态变化
  useEffect(() => {
    if (window.electronAPI?.onCollapseStateChanged) {
      window.electronAPI.onCollapseStateChanged((data) => {
        setIsCollapsed(data.isCollapsed);
        if (data.side) setCollapseSide(data.side);
      });
    }
  }, []);
  
  // 登录会话管理：登录后注册会话
  useEffect(() => {
    if (!currentUser) return;
    
    // 注册会话（使用 Electron API）
    if (window.electronAPI?.registerSession) {
      window.electronAPI.registerSession(currentUser.id, currentUser.username);
    }
    
    // 组件卸载时（比如登出）不需要手动清理，因为 handleLogout 会处理
  }, [currentUser]);
  
  // 未登录时自动展开窗口
  useEffect(() => {
    if (isCollapsed && !currentUser) {
      if (window.electronAPI?.expandWindow) {
        window.electronAPI.expandWindow();
      }
    }
  }, [isCollapsed, currentUser]);
  
  // 提醒功能：已触发的提醒ID集合（防止重复提醒）
  const triggeredRemindersRef = useRef(new Set());
  
  // 提醒检测
  useEffect(() => {
    if (!currentUser || notes.length === 0) return;
    
    // 检查是否有需要提醒的便签
    const checkReminders = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
      
      notes.forEach(note => {
        // 跳过没有开启提醒的便签
        if (!note.hasReminder || !note.reminderTime) return;
        
        // 确定提醒日期
        let reminderDate = null;
        let reminderMessage = '';
        let isAutoRenewReminder = false;
        
        // 获取便签所属类别
        const category = categories.find(c => c.id === note.categoryId);
        
        if (category?.noteType === 'date' && note.date) {
          // 重要日期：当天提醒
          reminderDate = note.date;
          reminderMessage = `${note.title}\n${note.date} ${note.reminderTime.slice(0, 5)}`;
        } else if (category?.noteType === 'membership' && note.endDate) {
          // 会员管理：提前N天提醒
          const reminderDays = note.reminderDays || 3;
          const endDate = new Date(note.endDate);
          endDate.setDate(endDate.getDate() - reminderDays);
          reminderDate = endDate.toISOString().split('T')[0];
          
          const daysLeft = getDaysRemaining(note.endDate);
          reminderMessage = `${note.title} 会员将在 ${daysLeft} 天后到期`;
          if (note.autoRenew) {
            reminderMessage += '\n⚠️ 已开启自动续费，如不需要请及时关闭';
            isAutoRenewReminder = true;
          }
        }
        
        if (!reminderDate) return;
        
        // 检查是否是今天
        if (reminderDate !== todayStr) return;
        
        // 生成唯一的提醒ID（便签ID + 日期 + 时间）
        const reminderId = `${note.id}_${reminderDate}_${note.reminderTime}`;
        
        // 检查是否已经触发过
        if (triggeredRemindersRef.current.has(reminderId)) return;
        
        // 精确比较时间（秒级）
        const reminderTime = note.reminderTime; // HH:MM:SS 或 HH:MM
        const reminderParts = reminderTime.split(':');
        const currentParts = currentTime.split(':');
        
        // 转换为总秒数进行比较
        const reminderSeconds = parseInt(reminderParts[0]) * 3600 + parseInt(reminderParts[1]) * 60 + (parseInt(reminderParts[2]) || 0);
        const currentSeconds = parseInt(currentParts[0]) * 3600 + parseInt(currentParts[1]) * 60 + parseInt(currentParts[2]);
        
        // 当前时间在提醒时间的0-5秒内触发（精确到秒）
        if (currentSeconds >= reminderSeconds && currentSeconds < reminderSeconds + 5) {
          // 标记为已触发
          triggeredRemindersRef.current.add(reminderId);
          
          // 触发提醒
          triggerReminder(note, reminderMessage, isAutoRenewReminder);
          
          // 自动关闭该便签的提醒（防止重复触发）
          setNotes(prevNotes => prevNotes.map(n => 
            n.id === note.id ? { ...n, hasReminder: false } : n
          ));
        }
      });
    };
    
    // 触发提醒
    const triggerReminder = (note, message, isAutoRenew) => {
      // 1. 播放提醒声音（如果开启）
      if (note.reminderSound) {
        playReminderSound();
      }
      
      // 2. 显示系统通知
      if ('Notification' in window) {
        const notificationTitle = isAutoRenew ? '糖糖便签 - 会员续费提醒' : '糖糖便签 - 提醒';
        if (Notification.permission === 'granted') {
          new Notification(notificationTitle, {
            body: message,
            icon: '/logo.png',
            tag: `reminder_${note.id}`,
            requireInteraction: true
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
              new Notification(notificationTitle, {
                body: message,
                icon: '/logo.png',
                tag: `reminder_${note.id}`,
                requireInteraction: true
              });
            }
          });
        }
      }
      
      // 3. 如果窗口是收缩状态，展开它
      if (isCollapsed && window.electronAPI?.expandWindow) {
        window.electronAPI.expandWindow();
      }
      
      // 4. 显示应用内提醒弹窗
      setReminderNote(note);
      setIsReminderModalOpen(true);
    };
    
    // 播放提醒声音
    const playReminderSound = () => {
      try {
        // 使用 Web Audio API 生成提示音
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const playBeep = (frequency, startTime, duration) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, startTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
          
          oscillator.start(startTime);
          oscillator.stop(startTime + duration);
        };
        
        // 播放三声提示音
        const now = audioContext.currentTime;
        playBeep(880, now, 0.15);        // A5
        playBeep(880, now + 0.2, 0.15);  // A5
        playBeep(1100, now + 0.4, 0.3);  // C#6
      } catch (e) {
        console.error('播放提醒声音失败:', e);
      }
    };
    
    // 请求通知权限
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // 每秒检查一次（精确到秒）
    const intervalId = setInterval(checkReminders, 1000);
    
    // 立即检查一次
    checkReminders();
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currentUser, notes, categories, isCollapsed]);
  
  // 提醒弹窗状态
  const [reminderNote, setReminderNote] = useState(null);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  
  // 展开窗口
  const handleExpandWindow = () => {
    if (window.electronAPI?.expandWindow) {
      window.electronAPI.expandWindow();
    }
  };
  
  // 加载全局数据（注册用户列表）
  useEffect(() => {
    const loadGlobalData = async () => {
      try {
        let savedData = null;
        
        if (window.electronAPI) {
          savedData = await window.electronAPI.loadData();
        } else {
          const saved = localStorage.getItem('globalData');
          if (saved) {
            savedData = JSON.parse(saved);
          }
        }
        
        if (savedData) {
          if (savedData.registeredUsers) {
            setRegisteredUsers(savedData.registeredUsers);
          }
          if (savedData.savedAccounts) {
            setSavedAccounts(savedData.savedAccounts);
          }
        }
      } catch (error) {
        console.error('加载全局数据失败:', error);
      }
      setIsDataLoaded(true);
    };
    
    loadGlobalData();
  }, []);
  
  // 当用户登录后，加载该用户的数据
  useEffect(() => {
    if (!currentUser) return;
    
    const loadUserData = async () => {
      try {
        let userData = null;
        const userKey = `userData_${currentUser.id}`;
        
        if (window.electronAPI) {
          const allData = await window.electronAPI.loadData();
          userData = allData?.[userKey];
        } else {
          const saved = localStorage.getItem(userKey);
          if (saved) {
            userData = JSON.parse(saved);
          }
        }
        
        if (userData) {
          setCategories(userData.categories || DEFAULT_CATEGORIES);
          setNotes(userData.notes || []);
          setPin(userData.pin || null);
          setUserAvatar(userData.avatar || null);
        } else {
          // 新用户，使用默认数据
          setCategories(DEFAULT_CATEGORIES);
          setNotes([]);
          setPin(null);
          setUserAvatar(null);
        }
      } catch (error) {
        console.error('加载用户数据失败:', error);
        setCategories(DEFAULT_CATEGORIES);
        setNotes([]);
        setPin(null);
        setUserAvatar(null);
      }
    };
    
    loadUserData();
  }, [currentUser]);
  
  // 保存全局数据（注册用户列表、已保存账号）
  const saveGlobalDataRef = useRef(null);
  useEffect(() => {
    if (!isDataLoaded) return;
    
    if (saveGlobalDataRef.current) {
      clearTimeout(saveGlobalDataRef.current);
    }
    
    saveGlobalDataRef.current = setTimeout(async () => {
      const globalData = { registeredUsers, savedAccounts };
      
      try {
        if (window.electronAPI) {
          const existingData = await window.electronAPI.loadData() || {};
          await window.electronAPI.saveData({ ...existingData, ...globalData });
        } else {
          localStorage.setItem('globalData', JSON.stringify(globalData));
        }
      } catch (error) {
        console.error('保存全局数据失败:', error);
      }
    }, 500);
    
    return () => {
      if (saveGlobalDataRef.current) {
        clearTimeout(saveGlobalDataRef.current);
      }
    };
  }, [registeredUsers, savedAccounts, isDataLoaded]);
  
  // 保存用户数据
  const saveUserDataRef = useRef(null);
  useEffect(() => {
    if (!isDataLoaded || !currentUser) return;
    
    if (saveUserDataRef.current) {
      clearTimeout(saveUserDataRef.current);
    }
    
    saveUserDataRef.current = setTimeout(async () => {
      const userKey = `userData_${currentUser.id}`;
      const userData = { categories, notes, pin, avatar: userAvatar };
      
      try {
        if (window.electronAPI) {
          const existingData = await window.electronAPI.loadData() || {};
          await window.electronAPI.saveData({ ...existingData, [userKey]: userData });
        } else {
          localStorage.setItem(userKey, JSON.stringify(userData));
        }
      } catch (error) {
        console.error('保存用户数据失败:', error);
      }
    }, 500);
    
    return () => {
      if (saveUserDataRef.current) {
        clearTimeout(saveUserDataRef.current);
      }
    };
  }, [categories, notes, pin, userAvatar, currentUser, isDataLoaded]);
  
  // 打开便签详情
  const handleOpenDetail = (note) => {
    if (note.isPrivate) {
      // 私密便签需要验证PIN
      setPendingPrivateNote(note);
      setIsPrivatePinModalOpen(true);
    } else {
      // 非私密便签直接打开
      setDetailNote(note);
      setIsDetailOpen(true);
    }
  };
  
  // PIN验证成功后打开私密便签
  const handlePrivatePinSuccess = () => {
    if (pendingPrivateNote) {
      setDetailNote(pendingPrivateNote);
      setIsDetailOpen(true);
      setPendingPrivateNote(null);
    }
    setIsPrivatePinModalOpen(false);
  };
  
  // 关闭详情视图
  const handleCloseDetail = () => {
    setDetailNote(null);
    setIsDetailOpen(false);
  };
  
  // 获取当前选中类别的noteType
  const activeCategoryType = useMemo(() => {
    if (activeCategory === 'all') return null;
    const cat = categories.find(c => c.id === activeCategory);
    return cat?.noteType || null;
  }, [activeCategory, categories]);
  
  // 获取当前类别可用的筛选选项
  const filterOptions = useMemo(() => {
    if (activeCategoryType === 'expense') {
      return EXPENSE_STATUS.map(s => ({ id: s.id, name: s.name, color: s.color, bg: s.bg }));
    } else if (activeCategoryType === 'date') {
      return [
        { id: 'not_expired', name: '未过期', color: 'text-green-600', bg: 'bg-green-100' },
        { id: 'expired', name: '已过期', color: 'text-gray-500', bg: 'bg-gray-100' },
      ];
    } else if (activeCategoryType === 'membership') {
      return MEMBERSHIP_STATUS.map(s => ({ id: s.id, name: s.name, color: s.color, bg: s.bg }));
    }
    return [];
  }, [activeCategoryType]);
  
  // 处理筛选选项变化
  const handleFilterChange = (filterId) => {
    if (filterId === 'all') {
      // 点击"全部"：选中全部，取消其他
      setStatusFilter(['all']);
    } else {
      setStatusFilter(prev => {
        // 移除 'all'
        let newFilter = prev.filter(f => f !== 'all');
        
        if (newFilter.includes(filterId)) {
          // 已选中，取消选中
          newFilter = newFilter.filter(f => f !== filterId);
          // 如果取消后为空，恢复为全部
          if (newFilter.length === 0) {
            return ['all'];
          }
        } else {
          // 未选中，添加选中
          newFilter = [...newFilter, filterId];
          // 如果选中了所有子选项，自动变为"全部"
          if (filterOptions.length > 0 && newFilter.length === filterOptions.length) {
            return ['all'];
          }
        }
        return newFilter;
      });
    }
  };
  
  // 点击外部关闭筛选下拉菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const filteredNotes = useMemo(() => {
    let result = notes.filter(note => {
      const matchesCategory = activeCategory === 'all' || note.categoryId === activeCategory;
      const matchesSearch = searchQuery === '' || note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.note?.toLowerCase().includes(searchQuery.toLowerCase()) || (!note.isPrivate && (note.username?.toLowerCase().includes(searchQuery.toLowerCase()) || note.url?.toLowerCase().includes(searchQuery.toLowerCase()) || note.content?.toLowerCase().includes(searchQuery.toLowerCase())));
      
      // 筛选逻辑
      let matchesFilter = true;
      if (!statusFilter.includes('all') && activeCategoryType) {
        if (activeCategoryType === 'expense') {
          // 报销记录：按状态筛选
          matchesFilter = statusFilter.includes(note.status);
        } else if (activeCategoryType === 'date') {
          // 重要日期：按过期/未过期筛选
          const today = new Date().toISOString().split('T')[0];
          const isExpired = note.date < today;
          if (statusFilter.includes('expired') && statusFilter.includes('not_expired')) {
            matchesFilter = true;
          } else if (statusFilter.includes('expired')) {
            matchesFilter = isExpired;
          } else if (statusFilter.includes('not_expired')) {
            matchesFilter = !isExpired;
          }
        } else if (activeCategoryType === 'membership') {
          // 会员管理：按状态筛选
          const memberStatus = getMembershipStatus(note.endDate);
          matchesFilter = statusFilter.includes(memberStatus);
        }
      }
      
      return matchesCategory && matchesSearch && matchesFilter;
    });
    
    // 排序逻辑
    result = [...result].sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === 'date' && activeCategoryType) {
        let dateA, dateB;
        
        if (activeCategoryType === 'expense') {
          // 报销记录按购买日期排序
          dateA = a.purchaseDate || '';
          dateB = b.purchaseDate || '';
        } else if (activeCategoryType === 'date') {
          // 重要日期按提醒日期排序
          dateA = a.date || '';
          dateB = b.date || '';
        } else if (activeCategoryType === 'membership') {
          // 会员管理按到期日期排序
          dateA = a.endDate || '';
          dateB = b.endDate || '';
        }
        
        // 日期相同则按创建时间排序
        if (dateA === dateB) {
          compareValue = (b.id || 0) - (a.id || 0);
        } else {
          compareValue = dateB.localeCompare(dateA);
        }
      } else if (sortBy === 'price' && activeCategoryType === 'membership') {
        // 会员管理按价格排序
        const priceA = calculateMembershipTotalCost(a);
        const priceB = calculateMembershipTotalCost(b);
        compareValue = priceB - priceA;
      } else {
        // 按创建时间排序（id是时间戳）
        compareValue = (b.id || 0) - (a.id || 0);
      }
      
      // 根据排序顺序调整
      return sortOrder === 'asc' ? -compareValue : compareValue;
    });
    
    return result;
  }, [notes, activeCategory, searchQuery, sortBy, sortOrder, activeCategoryType, statusFilter]);
  
  const privateCount = notes.filter(n => n.isPrivate).length;
  
  // 登录处理
  const handleLogin = (user) => {
    setCurrentUser(user);
    // 会话注册由useEffect自动处理
  };
  
  // 登出处理
  const handleLogout = () => {
    // 清除会话（使用 Electron API）
    if (window.electronAPI?.clearSession) {
      window.electronAPI.clearSession();
    }
    
    setCurrentUser(null);
    // 重置用户数据
    setCategories(DEFAULT_CATEGORIES);
    setNotes([]);
    setPin(null);
    setUserAvatar(null);
    setDetailNote(null);
    setIsDetailOpen(false);
    setActiveCategory('all');
    setSearchQuery('');
  };
  
  // 头像上传处理
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // 检查文件大小（限制5MB）
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      // 打开裁剪弹窗
      setAvatarToCrop(event.target.result);
      setIsAvatarCropOpen(true);
    };
    reader.readAsDataURL(file);
    
    // 清空input以便重复选择同一文件
    e.target.value = '';
  };
  
  // 头像裁剪确认
  const handleAvatarCropConfirm = (croppedImage) => {
    setUserAvatar(croppedImage);
    setIsAvatarCropOpen(false);
    setAvatarToCrop(null);
  };
  
  // 账号注销处理
  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    const userKey = `userData_${currentUser.id}`;
    
    try {
      // 删除用户数据
      if (window.electronAPI) {
        const existingData = await window.electronAPI.loadData() || {};
        delete existingData[userKey];
        await window.electronAPI.saveData(existingData);
      } else {
        localStorage.removeItem(userKey);
      }
      
      // 从注册用户列表中移除
      setRegisteredUsers(registeredUsers.filter(u => u.id !== currentUser.id));
      
      // 从保存的账号列表中移除
      setSavedAccounts(savedAccounts.filter(a => a.username !== currentUser.username));
      
      // 登出
      handleLogout();
      setIsDeleteAccountModalOpen(false);
    } catch (error) {
      console.error('删除账号失败:', error);
    }
  };
  
  // 数据加载中，显示加载界面
  if (!isDataLoaded) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
        {window.electronAPI && (
          <div className="h-8 bg-white/30 flex items-center justify-end px-2 shrink-0" style={{ WebkitAppRegion: 'drag' }}>
            <div style={{ WebkitAppRegion: 'no-drag' }} className="flex">
              <button onClick={() => window.electronAPI.windowMinimize()} className="w-10 h-8 flex items-center justify-center hover:bg-white/50"><Minus size={14} className="text-gray-500" /></button>
              <button onClick={() => window.electronAPI.windowClose()} className="w-10 h-8 flex items-center justify-center hover:bg-red-500 group"><X size={14} className="text-gray-500 group-hover:text-white" /></button>
            </div>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img src={logoImage} alt="糖糖便签" className="w-14 h-14 object-contain animate-pulse" />
            </div>
            <p className="text-gray-500">正在加载数据...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // 如果未登录，显示登录页面
  if (!currentUser) {
    return (
      <AuthPage 
        onLogin={handleLogin} 
        registeredUsers={registeredUsers}
        setRegisteredUsers={setRegisteredUsers}
        savedAccounts={savedAccounts}
        setSavedAccounts={setSavedAccounts}
      />
    );
  }
  
  // 如果处于收缩状态，显示收缩视图
  if (isCollapsed && currentUser) {
    return (
      <div 
        className="h-screen bg-white flex flex-col select-none rounded-2xl overflow-hidden border border-gray-200/80"
      >
        {/* 顶部拖动区域 */}
        <div 
          className="pt-4 pb-3 bg-gradient-to-b from-blue-500 to-purple-500 flex flex-col items-center rounded-t-2xl cursor-move"
          style={{ WebkitAppRegion: 'drag' }}
          title="拖动调整位置"
        >
          {/* Logo */}
          <div className="w-11 h-11 rounded-xl bg-white shadow flex items-center justify-center mb-2">
            <img src={logoImage} alt="糖糖便签" className="w-8 h-8 object-contain" />
          </div>
          {/* 头像 */}
          {userAvatar ? (
            <img src={userAvatar} alt="" className="w-9 h-9 rounded-full border-2 border-white" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
              <User size={16} className="text-purple-600" />
            </div>
          )}
        </div>
        
        {/* 类别图标区域 - 点击展开 */}
        <div 
          className="flex-1 flex flex-col gap-2.5 items-center justify-center py-3 cursor-pointer"
          onClick={handleExpandWindow}
          title="点击展开"
        >
          {categories.map(cat => {
            const Icon = getIconComponent(cat.iconName);
            const colorClasses = getColorClasses(cat.color);
            return (
              <div 
                key={cat.id} 
                className={`w-11 h-11 rounded-xl ${colorClasses.bg} flex items-center justify-center hover:scale-110 transition-transform shadow-sm`}
              >
                <Icon size={20} className={colorClasses.text} />
              </div>
            );
          })}
        </div>
        
        {/* 底部展开提示 - 点击展开 */}
        <div 
          className="pb-3 flex justify-center cursor-pointer"
          onClick={handleExpandWindow}
          title="点击展开"
        >
          <div className={`w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors ${collapseSide === 'right' ? '' : 'rotate-180'}`}>
            <ChevronLeft size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-screen bg-transparent flex flex-col p-1">
      {/* 圆角容器 - 细边框 */}
      <div 
        className="h-full bg-gray-50 flex flex-col rounded-2xl overflow-hidden border border-gray-200/80"
      >
      {/* 自定义标题栏 - 仅在 Electron 中显示 */}
      {window.electronAPI && (
        <div 
          className="h-8 bg-white border-b border-gray-200 flex items-center justify-between px-2 shrink-0 rounded-t-2xl"
          style={{ WebkitAppRegion: 'drag' }}
        >
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="糖糖便签" className="w-5 h-5 object-contain" />
            <span className="text-xs text-gray-600 font-medium">糖糖便签</span>
          </div>
          <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' }}>
            <button
              onClick={() => window.electronAPI.windowMinimize()}
              className="w-10 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Minus size={14} className="text-gray-500" />
            </button>
            <button
              onClick={() => window.electronAPI.windowMaximize()}
              className="w-10 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <Square size={12} className="text-gray-500" />
            </button>
            <button
              onClick={() => window.electronAPI.windowClose()}
              className="w-10 h-8 flex items-center justify-center hover:bg-red-500 group transition-colors"
            >
              <X size={14} className="text-gray-500 group-hover:text-white" />
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 p-4 flex flex-col">
        {/* 用户信息 - 点击打开个人主页 */}
        <div 
          className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg cursor-pointer hover:from-blue-100 hover:to-purple-100 transition-all"
          onClick={() => setIsProfileModalOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* 头像 */}
              <div className="relative">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt="头像" 
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white shadow-sm">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{currentUser.username}</p>
                <p className="text-xs text-gray-500">点击管理账号</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>
        </div>
        
        {/* 隐藏的头像上传input */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />
        
        <ExpenseStats notes={notes} categories={categories} />
        <MembershipStats notes={notes} categories={categories} />
        
        {privateCount > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-violet-50 flex items-center gap-2">
            <Lock size={16} className="text-violet-600" />
            <span className="text-sm text-violet-700">{privateCount} 个私密便签</span>
          </div>
        )}
        
        <nav className="space-y-1 flex-1 overflow-y-auto">
          <button onClick={() => { setActiveCategory('all'); setSortBy('created'); setSortOrder('desc'); setStatusFilter(['all']); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${activeCategory === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            <div className="flex items-center gap-2"><Folder size={18} /><span className="font-medium">全部</span></div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === 'all' ? 'bg-blue-100' : 'bg-gray-100'}`}>{notes.length}</span>
          </button>
          <div className="h-px bg-gray-100 my-2" />
          {categories.map((cat, index) => {
            const Icon = getIconComponent(cat.iconName);
            const colorClasses = getColorClasses(cat.color);
            const count = notes.filter(n => n.categoryId === cat.id).length;
            const isDragging = draggedCategory === cat.id;
            const isDragOver = dragOverCategory === cat.id;
            
            return (
              <div 
                key={cat.id} 
                className={`group relative transition-all ${isDragging ? 'opacity-50' : ''} ${isDragOver ? 'border-t-2 border-blue-500' : ''}`}
                draggable
                onDragStart={(e) => {
                  setDraggedCategory(cat.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragEnd={() => {
                  setDraggedCategory(null);
                  setDragOverCategory(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (draggedCategory && draggedCategory !== cat.id) {
                    setDragOverCategory(cat.id);
                  }
                }}
                onDragLeave={() => {
                  setDragOverCategory(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedCategory && draggedCategory !== cat.id) {
                    // 重新排序
                    const dragIndex = categories.findIndex(c => c.id === draggedCategory);
                    const dropIndex = categories.findIndex(c => c.id === cat.id);
                    const newCategories = [...categories];
                    const [draggedItem] = newCategories.splice(dragIndex, 1);
                    newCategories.splice(dropIndex, 0, draggedItem);
                    setCategories(newCategories);
                  }
                  setDraggedCategory(null);
                  setDragOverCategory(null);
                }}
              >
                <button onClick={() => { setActiveCategory(cat.id); setSortBy('created'); setSortOrder('desc'); setStatusFilter(['all']); }} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${activeCategory === cat.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2">
                    <GripVertical size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing" />
                    <div className={`w-6 h-6 rounded-md ${colorClasses.bg} flex items-center justify-center`}><Icon size={14} className={colorClasses.text} /></div>
                    <span className="font-medium text-sm">{cat.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-blue-100' : 'bg-gray-100'}`}>{count}</span>
                </button>
                <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="absolute right-10 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200 transition-all"><Edit3 size={12} className="text-gray-400" /></button>
              </div>
            );
          })}
        </nav>
        
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }} className="w-full text-gray-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"><Settings size={16} />管理类别</button>
          <button onClick={() => { setEditingNote(null); setIsNoteModalOpen(true); }} className="w-full bg-blue-500 text-white py-2.5 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><Plus size={18} />新建便签</button>
        </div>
      </div>
      
      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="搜索便签..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          
          {/* 排序按钮（仅报销记录和重要日期显示） */}
          {(activeCategoryType === 'expense' || activeCategoryType === 'date' || activeCategoryType === 'membership') && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700 cursor-pointer"
                >
                  <option value="created">按创建时间</option>
                  <option value="date">
                    {activeCategoryType === 'expense' ? '按购买日期' : activeCategoryType === 'membership' ? '按到期日期' : '按提醒日期'}
                  </option>
                  {activeCategoryType === 'membership' && <option value="price">按累计花费</option>}
                </select>
                <ArrowUpDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              {/* 升序/降序切换按钮 */}
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700"
                title={sortOrder === 'desc' ? '当前：降序（新→旧）' : '当前：升序（旧→新）'}
              >
                {sortOrder === 'desc' ? (
                  <>
                    <ArrowDown size={16} className="text-blue-500" />
                    <span>降序</span>
                  </>
                ) : (
                  <>
                    <ArrowUp size={16} className="text-blue-500" />
                    <span>升序</span>
                  </>
                )}
              </button>
              
              {/* 筛选按钮 */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 border rounded-xl transition-colors text-sm ${
                    statusFilter.includes('all') 
                      ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' 
                      : 'bg-blue-50 border-blue-200 text-blue-600'
                  }`}
                >
                  <Filter size={16} className={statusFilter.includes('all') ? 'text-gray-400' : 'text-blue-500'} />
                  <span>筛选</span>
                  {!statusFilter.includes('all') && (
                    <span className="ml-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      {statusFilter.length}
                    </span>
                  )}
                </button>
                
                {/* 筛选下拉菜单 */}
                {isFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 min-w-[160px]">
                    {/* 全部选项 */}
                    <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statusFilter.includes('all')}
                        onChange={() => handleFilterChange('all')}
                        className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 font-medium">全部</span>
                    </label>
                    
                    <div className="h-px bg-gray-100 my-1" />
                    
                    {/* 各状态选项 */}
                    {filterOptions.map(option => (
                      <label key={option.id} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusFilter.includes('all') || statusFilter.includes(option.id)}
                          onChange={() => handleFilterChange(option.id)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className={`text-sm ${option.color}`}>{option.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map(note => {
            const category = categories.find(c => c.id === note.categoryId);
            if (!category) return null;
            return (
              <NoteCard 
                key={note.id} 
                note={note} 
                category={category} 
                onEdit={(n) => { setEditingNote(n); setIsNoteModalOpen(true); }} 
                onDelete={(id) => setNotes(notes.filter(n => n.id !== id))} 
                onUpdateStatus={(id, status) => setNotes(notes.map(n => n.id === id ? {...n, status} : n))}
                onOpenDetail={handleOpenDetail}
                pin={pin}
                onSetPin={setPin}
              />
            );
          })}
        </div>
        
        {filteredNotes.length === 0 && <div className="text-center py-12"><StickyNote size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-500">暂无便签</p></div>}
      </div>
      </div>
      
      <NoteModal isOpen={isNoteModalOpen} onClose={() => { setIsNoteModalOpen(false); setEditingNote(null); }} onSave={(note) => { if (editingNote) setNotes(notes.map(n => n.id === note.id ? note : n)); else setNotes([note, ...notes]); setEditingNote(null); }} editingNote={editingNote} categories={categories} defaultCategoryId={activeCategory !== 'all' ? activeCategory : null} />
      <CategoryModal isOpen={isCategoryModalOpen} onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }} categories={categories} onSave={(cat) => { const exists = categories.find(c => c.id === cat.id); if (exists) setCategories(categories.map(c => c.id === cat.id ? cat : c)); else setCategories([...categories, cat]); setEditingCategory(null); }} onDelete={(id) => { setCategories(categories.filter(c => c.id !== id)); setNotes(notes.filter(n => n.categoryId !== id)); if (activeCategory === id) setActiveCategory('all'); }} editingCategory={editingCategory} />
      
      {/* 提醒弹窗 */}
      <ReminderModal 
        isOpen={isReminderModalOpen} 
        onClose={() => setIsReminderModalOpen(false)} 
        note={reminderNote} 
      />
      
      {/* 便签详情弹窗 */}
      <NoteDetailModal 
        isOpen={isDetailOpen} 
        onClose={handleCloseDetail} 
        note={detailNote} 
        category={detailNote ? categories.find(c => c.id === detailNote.categoryId) : null}
        onUpdateStatus={(id, status) => {
          setNotes(notes.map(n => n.id === id ? {...n, status} : n));
          if (detailNote && detailNote.id === id) {
            setDetailNote({...detailNote, status});
          }
        }}
        onEdit={(n) => { 
          setEditingNote(n); 
          setIsNoteModalOpen(true); 
        }}
        onDelete={(id) => {
          setNotes(notes.filter(n => n.id !== id));
        }}
      />
      
      {/* 私密便签PIN验证弹窗 */}
      <PrivatePinModal 
        isOpen={isPrivatePinModalOpen} 
        onClose={() => { setIsPrivatePinModalOpen(false); setPendingPrivateNote(null); }} 
        onSuccess={handlePrivatePinSuccess} 
        pin={pin} 
        setPin={setPin}
        currentUser={currentUser}
      />
      
      {/* 个人主页弹窗 */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        userAvatar={userAvatar}
        onChangeAvatar={() => { setIsProfileModalOpen(false); avatarInputRef.current?.click(); }}
        onLogout={handleLogout}
        onDeleteAccount={() => setIsDeleteAccountModalOpen(true)}
      />
      
      {/* 账号注销弹窗 */}
      <DeleteAccountModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        currentUser={currentUser}
      />
      
      {/* 头像裁剪弹窗 */}
      <AvatarCropModal
        isOpen={isAvatarCropOpen}
        onClose={() => { setIsAvatarCropOpen(false); setAvatarToCrop(null); }}
        imageData={avatarToCrop}
        onConfirm={handleAvatarCropConfirm}
      />
      </div>
    </div>
  );
}
