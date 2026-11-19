import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  Repeat,
  PieChart as PieChartIcon,
  Receipt,
  TrendingUp,
  Target,
  Plus,
  Search,
  Download,
  Upload,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  X,
  Scissors,
  Wand2,
  Sun,
  Moon,
  Menu,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
  Wallet,
  Building2,
  RotateCcw,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const STORAGE_KEY = 'rocket_money_personal_prototype_v1';

const CATEGORY_COLORS = {
  Housing: '#6366f1',
  Groceries: '#10b981',
  Dining: '#f59e0b',
  Subscriptions: '#ec4899',
  Utilities: '#06b6d4',
  Transportation: '#8b5cf6',
  Shopping: '#f97316',
  Healthcare: '#14b8a6',
  Entertainment: '#e11d48',
  Income: '#22c55e',
  Other: '#64748b',
};

const DEFAULT_CATEGORIES = Object.keys(CATEGORY_COLORS).filter((c) => c !== 'Income');

const SEED_DATA = {
  accounts: [
    { id: 'acc-1', name: 'Main Checking', type: 'asset', subtype: 'Checking', balance: 6420.5, institution: 'Chase' },
    { id: 'acc-2', name: 'High-Yield Savings', type: 'asset', subtype: 'Savings', balance: 18500.0, institution: 'Ally' },
    { id: 'acc-3', name: 'Brokerage & Index ETFs', type: 'asset', subtype: 'Investment', balance: 42300.0, institution: 'Fidelity' },
    { id: 'acc-4', name: 'Sapphire Rewards Card', type: 'liability', subtype: 'Credit Card', balance: 1480.25, institution: 'Chase' },
    { id: 'acc-5', name: 'Auto Loan', type: 'liability', subtype: 'Loan', balance: 11200.0, institution: 'Credit Union' },
  ],
  subscriptions: [
    { id: 'sub-1', name: 'Netflix Premium', amount: 22.99, cadence: 'monthly', nextDue: '2026-11-24', category: 'Subscriptions', status: 'active', priceHike: true, notes: 'Increased from $19.99 last quarter' },
    { id: 'sub-2', name: 'Spotify Duo', amount: 16.99, cadence: 'monthly', nextDue: '2026-11-26', category: 'Subscriptions', status: 'active', priceHike: false, notes: '' },
    { id: 'sub-3', name: 'Fiber Internet 1Gbps', amount: 79.0, cadence: 'monthly', nextDue: '2026-11-28', category: 'Utilities', status: 'active', priceHike: false, notes: 'Promo rate expires Feb 2027' },
    { id: 'sub-4', name: 'Cloud Storage 2TB', amount: 9.99, cadence: 'monthly', nextDue: '2026-12-01', category: 'Subscriptions', status: 'active', priceHike: false, notes: '' },
    { id: 'sub-5', name: 'Gym Membership', amount: 49.0, cadence: 'monthly', nextDue: '2026-12-03', category: 'Healthcare', status: 'watchlist', priceHike: false, notes: 'Check usage before next billing cycle' },
    { id: 'sub-6', name: 'Amazon Prime', amount: 139.0, cadence: 'yearly', nextDue: '2027-03-15', category: 'Subscriptions', status: 'active', priceHike: false, notes: '' },
    { id: 'sub-7', name: 'Legacy Design Tool', amount: 15.0, cadence: 'monthly', nextDue: '2026-11-10', category: 'Subscriptions', status: 'cancelled', priceHike: false, notes: 'Cancelled via account billing page' },
  ],
  budgets: [
    { id: 'bud-1', category: 'Groceries', limit: 650, rollover: true },
    { id: 'bud-2', category: 'Dining', limit: 350, rollover: false },
    { id: 'bud-3', category: 'Subscriptions', limit: 150, rollover: false },
    { id: 'bud-4', category: 'Utilities', limit: 250, rollover: false },
    { id: 'bud-5', category: 'Transportation', limit: 220, rollover: true },
    { id: 'bud-6', category: 'Shopping', limit: 300, rollover: false },
    { id: 'bud-7', category: 'Entertainment', limit: 180, rollover: false },
  ],
  transactions: [
    { id: 'tx-1', date: '2026-11-18', merchant: 'Whole Foods Market', amount: -142.6, category: 'Groceries', account: 'Sapphire Rewards Card', tags: ['food', 'weekly'], notes: 'Weekly produce & pantry' },
    { id: 'tx-2', date: '2026-11-17', merchant: 'Payroll Direct Deposit', amount: 3450.0, category: 'Income', account: 'Main Checking', tags: ['salary'], notes: 'Bi-weekly paycheck' },
    { id: 'tx-3', date: '2026-11-16', merchant: 'Trader Joes', amount: -86.4, category: 'Groceries', account: 'Sapphire Rewards Card', tags: ['food'], notes: '' },
    { id: 'tx-4', date: '2026-11-15', merchant: 'Sweetgreen', amount: -18.75, category: 'Dining', account: 'Sapphire Rewards Card', tags: ['lunch'], notes: '' },
    { id: 'tx-5', date: '2026-11-14', merchant: 'ConEdison Electric', amount: -118.2, category: 'Utilities', account: 'Main Checking', tags: ['bill'], notes: 'Monthly electric bill' },
    { id: 'tx-6', date: '2026-11-12', merchant: 'Shell Gas Station', amount: -48.5, category: 'Transportation', account: 'Sapphire Rewards Card', tags: ['fuel'], notes: '' },
    { id: 'tx-7', date: '2026-11-10', merchant: 'Target', amount: -124.9, category: 'Shopping', account: 'Sapphire Rewards Card', tags: ['household'], notes: 'Household supplies' },
    { id: 'tx-8', date: '2026-11-08', merchant: 'Sushi Nakazawa', amount: -112.0, category: 'Dining', account: 'Sapphire Rewards Card', tags: ['dinner'], notes: 'Weekend dinner' },
    { id: 'tx-9', date: '2026-11-05', merchant: 'Metro Transit', amount: -64.0, category: 'Transportation', account: 'Main Checking', tags: ['commute'], notes: '' },
    { id: 'tx-10', date: '2026-11-03', merchant: 'Payroll Direct Deposit', amount: 3450.0, category: 'Income', account: 'Main Checking', tags: ['salary'], notes: 'Bi-weekly paycheck' },
    { id: 'tx-11', date: '2026-11-01', merchant: 'Oakwood Apartments', amount: -1950.0, category: 'Housing', account: 'Main Checking', tags: ['rent'], notes: 'November rent' },
    { id: 'tx-12', date: '2026-10-25', merchant: 'Costco Wholesale', amount: -215.3, category: 'Groceries', account: 'Sapphire Rewards Card', tags: ['bulk'], notes: '' },
    { id: 'tx-13', date: '2026-10-20', merchant: 'Payroll Direct Deposit', amount: 3450.0, category: 'Income', account: 'Main Checking', tags: ['salary'], notes: '' },
    { id: 'tx-14', date: '2026-10-12', merchant: 'AMC Theatres', amount: -42.0, category: 'Entertainment', account: 'Sapphire Rewards Card', tags: ['movies'], notes: '' },
  ],
  rules: [
    { id: 'rule-1', keyword: 'whole foods', category: 'Groceries' },
    { id: 'rule-2', keyword: 'trader joes', category: 'Groceries' },
    { id: 'rule-3', keyword: 'netflix', category: 'Subscriptions' },
    { id: 'rule-4', keyword: 'shell', category: 'Transportation' },
  ],
  goals: [
    { id: 'goal-1', name: 'Emergency Fund (6 Months)', target: 24000, saved: 18500, targetDate: '2027-06-01', monthlyContribution: 600 },
    { id: 'goal-2', name: 'Japan Autumn Trip', target: 5000, saved: 2850, targetDate: '2027-09-15', monthlyContribution: 250 },
    { id: 'goal-3', name: 'Pay Off Auto Loan Early', target: 11200, saved: 4200, targetDate: '2028-01-01', monthlyContribution: 350 },
  ],
  netWorthHistory: [
    { month: 'Jun', assets: 59800, liabilities: 15200 },
    { month: 'Jul', assets: 61200, liabilities: 14700 },
    { month: 'Aug', assets: 62500, liabilities: 14100 },
    { month: 'Sep', assets: 64100, liabilities: 13600 },
    { month: 'Oct', assets: 65800, liabilities: 13100 },
  ],
};

const EMPTY_DATA = {
  accounts: [],
  subscriptions: [],
  budgets: [],
  transactions: [],
  rules: [],
  goals: [],
  netWorthHistory: [],
};

const formatCurrency = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(num);
};

const monthlyEquivalent = (amount, cadence) => {
  const num = Number(amount) || 0;
  if (cadence === 'weekly') return (num * 52) / 12;
  if (cadence === 'yearly') return num / 12;
  return num;
};

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore storage errors
    }
    return SEED_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore storage errors
    }
  }, [data]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // --- Derived Metrics ---
  const currentMonth = '2026-11';
  const currentMonthTx = useMemo(
    () => data.transactions.filter((t) => (t.date || '').startsWith(currentMonth)),
    [data.transactions]
  );

  const monthlyIncome = useMemo(
    () => currentMonthTx.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
    [currentMonthTx]
  );

  const monthlySpend = useMemo(
    () => currentMonthTx.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0),
    [currentMonthTx]
  );

  const totalAssets = useMemo(
    () => data.accounts.filter((a) => a.type === 'asset').reduce((s, a) => s + Number(a.balance || 0), 0),
    [data.accounts]
  );

  const totalLiabilities = useMemo(
    () => data.accounts.filter((a) => a.type === 'liability').reduce((s, a) => s + Number(a.balance || 0), 0),
    [data.accounts]
  );

  const netWorth = totalAssets - totalLiabilities;

  const activeSubs = useMemo(
    () => data.subscriptions.filter((s) => s.status !== 'cancelled'),
    [data.subscriptions]
  );

  const monthlyRecurringTotal = useMemo(
    () => activeSubs.reduce((s, sub) => s + monthlyEquivalent(sub.amount, sub.cadence), 0),
    [activeSubs]
  );

  const categorySpendMap = useMemo(() => {
    const map = {};
    currentMonthTx
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
      });
    return map;
  }, [currentMonthTx]);

  const cashflowChartData = useMemo(() => {
    const months = ['2026-08', '2026-09', '2026-10', '2026-11'];
    const labels = { '2026-08': 'Aug', '2026-09': 'Sep', '2026-10': 'Oct', '2026-11': 'Nov' };
    const baseline = {
      '2026-08': { income: 6750, spend: 4120 },
      '2026-09': { income: 6900, spend: 3980 },
      '2026-10': { income: 6900, spend: 4290 },
      '2026-11': { income: 0, spend: 0 },
    };
    return months.map((m) => {
      const txs = data.transactions.filter((t) => (t.date || '').startsWith(m));
      const inc = txs.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
      const sp = txs.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
      return {
        month: labels[m],
        Income: inc > 0 ? Math.round(inc) : baseline[m].income,
        Spending: sp > 0 ? Math.round(sp) : baseline[m].spend,
      };
    });
  }, [data.transactions]);

  const netWorthChartData = useMemo(() => {
    const hist = data.netWorthHistory.map((h) => ({
      month: h.month,
      NetWorth: h.assets - h.liabilities,
      Assets: h.assets,
      Liabilities: h.liabilities,
    }));
    hist.push({
      month: 'Nov',
      NetWorth: Math.round(netWorth),
      Assets: Math.round(totalAssets),
      Liabilities: Math.round(totalLiabilities),
    });
    return hist;
  }, [data.netWorthHistory, netWorth, totalAssets, totalLiabilities]);

  // --- Modals & Interactive States ---
  const [subFilter, setSubFilter] = useState('all');
  const [subSearch, setSubSearch] = useState('');
  const [showSubModal, setShowSubModal] = useState(false);
  const [subForm, setSubForm] = useState({ name: '', amount: '', cadence: 'monthly', nextDue: '2026-12-01', category: 'Subscriptions', notes: '' });
  const [cancelGuideSub, setCancelGuideSub] = useState(null);

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetForm, setBudgetForm] = useState({ category: 'Groceries', limit: '', rollover: false });

  const [txSearch, setTxSearch] = useState('');
  const [txCategoryFilter, setTxCategoryFilter] = useState('All');
  const [txTypeFilter, setTxTypeFilter] = useState('all');
  const [showTxModal, setShowTxModal] = useState(false);
  const [txForm, setTxForm] = useState({ date: '2026-11-19', merchant: '', amount: '', type: 'expense', category: 'Groceries', account: 'Main Checking', tags: '', notes: '' });
  const [splitTx, setSplitTx] = useState(null);
  const [splitParts, setSplitParts] = useState([]);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [ruleForm, setRuleForm] = useState({ keyword: '', category: 'Groceries' });

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountForm, setAccountForm] = useState({ name: '', type: 'asset', subtype: 'Checking', balance: '', institution: '' });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ name: '', target: '', saved: '', targetDate: '2027-12-01', monthlyContribution: '' });

  // --- Handlers ---
  const handleAddSubscription = (e) => {
    e.preventDefault();
    if (!subForm.name.trim() || !subForm.amount) return;
    const newSub = {
      id: `sub-${Date.now()}`,
      name: subForm.name.trim(),
      amount: parseFloat(subForm.amount),
      cadence: subForm.cadence,
      nextDue: subForm.nextDue,
      category: subForm.category,
      status: 'active',
      priceHike: false,
      notes: subForm.notes.trim(),
    };
    setData((prev) => ({ ...prev, subscriptions: [newSub, ...prev.subscriptions] }));
    setSubForm({ name: '', amount: '', cadence: 'monthly', nextDue: '2026-12-01', category: 'Subscriptions', notes: '' });
    setShowSubModal(false);
    showToast(`Added ${newSub.name} to recurring bills`);
  };

  const updateSubStatus = (id, status) => {
    setData((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) => (s.id === id ? { ...s, status } : s)),
    }));
    showToast(`Updated subscription status to ${status}`);
  };

  const deleteSubscription = (id) => {
    setData((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.filter((s) => s.id !== id),
    }));
    showToast('Removed subscription');
  };

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!budgetForm.category.trim() || !budgetForm.limit) return;
    const exists = data.budgets.find((b) => b.category.toLowerCase() === budgetForm.category.trim().toLowerCase());
    if (exists) {
      setData((prev) => ({
        ...prev,
        budgets: prev.budgets.map((b) =>
          b.id === exists.id ? { ...b, limit: parseFloat(budgetForm.limit), rollover: budgetForm.rollover } : b
        ),
      }));
      showToast(`Updated ${budgetForm.category} budget`);
    } else {
      setData((prev) => ({
        ...prev,
        budgets: [
          ...prev.budgets,
          { id: `bud-${Date.now()}`, category: budgetForm.category.trim(), limit: parseFloat(budgetForm.limit), rollover: budgetForm.rollover },
        ],
      }));
      showToast(`Created ${budgetForm.category} budget`);
    }
    setBudgetForm({ category: 'Groceries', limit: '', rollover: false });
    setShowBudgetModal(false);
  };

  const deleteBudget = (id) => {
    setData((prev) => ({ ...prev, budgets: prev.budgets.filter((b) => b.id !== id) }));
    showToast('Budget category removed');
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!txForm.merchant.trim() || !txForm.amount) return;
    const rawAmt = Math.abs(parseFloat(txForm.amount));
    const signedAmt = txForm.type === 'income' ? rawAmt : -rawAmt;
    let resolvedCategory = txForm.type === 'income' ? 'Income' : txForm.category;
    const matchedRule = data.rules.find((r) => txForm.merchant.toLowerCase().includes(r.keyword.toLowerCase()));
    if (matchedRule && txForm.type === 'expense') {
      resolvedCategory = matchedRule.category;
    }
    const newTx = {
      id: `tx-${Date.now()}`,
      date: txForm.date,
      merchant: txForm.merchant.trim(),
      amount: signedAmt,
      category: resolvedCategory,
      account: txForm.account,
      tags: txForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      notes: txForm.notes.trim(),
    };
    setData((prev) => ({ ...prev, transactions: [newTx, ...prev.transactions] }));
    setTxForm({ date: '2026-11-19', merchant: '', amount: '', type: 'expense', category: 'Groceries', account: 'Main Checking', tags: '', notes: '' });
    setShowTxModal(false);
    showToast(`Added transaction (${resolvedCategory})`);
  };

  const openSplitModal = (tx) => {
    const absAmt = Math.abs(tx.amount);
    const half = Number((absAmt / 2).toFixed(2));
    const rem = Number((absAmt - half).toFixed(2));
    setSplitTx(tx);
    setSplitParts([
      { category: tx.category, amount: half },
      { category: 'Shopping', amount: rem },
    ]);
  };

  const handleConfirmSplit = () => {
    if (!splitTx) return;
    const totalTarget = Math.abs(splitTx.amount);
    const sumParts = splitParts.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);
    if (Math.abs(sumParts - totalTarget) > 0.02) {
      showToast(`Split amounts must equal ${formatCurrency(totalTarget)}`, 'error');
      return;
    }
    const sign = splitTx.amount < 0 ? -1 : 1;
    const newRows = splitParts.map((p, idx) => ({
      ...splitTx,
      id: `${splitTx.id}-split-${idx}-${Date.now()}`,
      category: p.category,
      amount: sign * Math.abs(parseFloat(p.amount)),
      notes: `${splitTx.notes ? splitTx.notes + ' ' : ''}(Split ${idx + 1}/${splitParts.length})`,
    }));
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.flatMap((t) => (t.id === splitTx.id ? newRows : [t])),
    }));
    setSplitTx(null);
    showToast('Transaction split successfully');
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!ruleForm.keyword.trim()) return;
    const newRule = { id: `rule-${Date.now()}`, keyword: ruleForm.keyword.trim(), category: ruleForm.category };
    setData((prev) => ({ ...prev, rules: [newRule, ...prev.rules] }));
    setRuleForm({ keyword: '', category: 'Groceries' });
    showToast(`Rule added for "${newRule.keyword}"`);
  };

  const applyAllRules = () => {
    let updatedCount = 0;
    const nextTxs = data.transactions.map((t) => {
      if (t.amount >= 0) return t;
      const match = data.rules.find((r) => t.merchant.toLowerCase().includes(r.keyword.toLowerCase()));
      if (match && t.category !== match.category) {
        updatedCount += 1;
        return { ...t, category: match.category };
      }
      return t;
    });
    setData((prev) => ({ ...prev, transactions: nextTxs }));
    showToast(`Applied rules: ${updatedCount} transaction(s) recategorized`);
  };

  const handleCsvImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || '');
      const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        showToast('CSV needs a header row and at least one transaction', 'error');
        return;
      }
      const imported = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length < 3) continue;
        const [date, merchant, rawAmount, cat = 'Other', account = 'Imported CSV'] = cols;
        const amt = parseFloat(rawAmount);
        if (Number.isNaN(amt)) continue;
        const matchedRule = data.rules.find((r) => merchant.toLowerCase().includes(r.keyword.toLowerCase()));
        imported.push({
          id: `csv-${Date.now()}-${i}`,
          date: date || '2026-11-19',
          merchant: merchant || 'Imported Merchant',
          amount: amt,
          category: amt > 0 ? 'Income' : matchedRule ? matchedRule.category : cat || 'Other',
          account,
          tags: ['imported'],
          notes: 'Imported from CSV',
        });
      }
      if (imported.length === 0) {
        showToast('No valid rows found in CSV', 'error');
        return;
      }
      setData((prev) => ({ ...prev, transactions: [...imported, ...prev.transactions] }));
      showToast(`Imported ${imported.length} transaction(s)`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCsvExport = () => {
    const header = 'date,merchant,amount,category,account,notes';
    const rows = data.transactions.map((t) =>
      [t.date, `"${t.merchant}"`, t.amount, t.category, `"${t.account}"`, `"${t.notes || ''}"`].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${currentMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported transactions CSV');
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    if (!accountForm.name.trim() || accountForm.balance === '') return;
    const acc = {
      id: `acc-${Date.now()}`,
      name: accountForm.name.trim(),
      type: accountForm.type,
      subtype: accountForm.subtype,
      balance: parseFloat(accountForm.balance),
      institution: accountForm.institution.trim() || 'Manual',
    };
    setData((prev) => ({ ...prev, accounts: [...prev.accounts, acc] }));
    setAccountForm({ name: '', type: 'asset', subtype: 'Checking', balance: '', institution: '' });
    setShowAccountModal(false);
    showToast(`Added ${acc.name}`);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalForm.name.trim() || !goalForm.target) return;
    const goal = {
      id: `goal-${Date.now()}`,
      name: goalForm.name.trim(),
      target: parseFloat(goalForm.target),
      saved: parseFloat(goalForm.saved || 0),
      targetDate: goalForm.targetDate,
      monthlyContribution: parseFloat(goalForm.monthlyContribution || 0),
    };
    setData((prev) => ({ ...prev, goals: [...prev.goals, goal] }));
    setGoalForm({ name: '', target: '', saved: '', targetDate: '2027-12-01', monthlyContribution: '' });
    setShowGoalModal(false);
    showToast(`Created goal: ${goal.name}`);
  };

  const contributeToGoal = (id, delta) => {
    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, saved: Math.min(g.target, g.saved + delta) } : g)),
    }));
    showToast(`Added ${formatCurrency(delta)} toward goal`);
  };

  const filteredSubs = useMemo(() => {
    return data.subscriptions.filter((s) => {
      const matchStatus = subFilter === 'all' || s.status === subFilter;
      const matchSearch = s.name.toLowerCase().includes(subSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [data.subscriptions, subFilter, subSearch]);

  const filteredTxs = useMemo(() => {
    return data.transactions.filter((t) => {
      const matchSearch =
        t.merchant.toLowerCase().includes(txSearch.toLowerCase()) ||
        (t.notes || '').toLowerCase().includes(txSearch.toLowerCase());
      const matchCat = txCategoryFilter === 'All' || t.category === txCategoryFilter;
      const matchType =
        txTypeFilter === 'all' ||
        (txTypeFilter === 'expense' && t.amount < 0) ||
        (txTypeFilter === 'income' && t.amount > 0);
      return matchSearch && matchCat && matchType;
    });
  }, [data.transactions, txSearch, txCategoryFilter, txTypeFilter]);

  const spendingPieData = useMemo(() => {
    return Object.entries(categorySpendMap)
      .map(([name, value]) => ({ name, value: Number(value.toFixed(2)), color: CATEGORY_COLORS[name] || '#64748b' }))
      .sort((a, b) => b.value - a.value);
  }, [categorySpendMap]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subscriptions', label: 'Recurring', icon: Repeat },
    { id: 'budgets', label: 'Budgets', icon: PieChartIcon },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'networth', label: 'Net Worth', icon: TrendingUp },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  // Theme classes
  const bgMain = dark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const bgCard = dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const bgMuted = dark ? 'bg-slate-800/70' : 'bg-slate-100';
  const textMuted = dark ? 'text-slate-400' : 'text-slate-500';
  const inputCls = dark
    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-emerald-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-600';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors ${bgMain}`}>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
          }`}
        >
          {toast.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside
        className={`hidden md:flex md:w-64 md:flex-col border-r p-4 justify-between ${
          dark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5 px-2 py-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight">FinFlow</div>
              <div className={`text-xs ${textMuted}`}>Personal Finance Hub</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : `${textMuted} hover:bg-slate-800/40`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-800/50">
          <button
            onClick={() => setDark(!dark)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium ${bgMuted}`}
          >
            <span>{dark ? 'Dark Mode' : 'Light Mode'}</span>
            {dark ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setData(SEED_DATA);
                showToast('Restored demo sample data');
              }}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-medium ${bgMuted} hover:opacity-80`}
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Demo
            </button>
            <button
              onClick={() => {
                setData(EMPTY_DATA);
                showToast('Cleared sample data');
              }}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-xl text-xs font-medium text-rose-400 ${bgMuted} hover:opacity-80`}
              title="Clear All Data"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className={`md:hidden flex items-center justify-between px-4 py-3 border-b ${
          dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold">FinFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDark(!dark)} className={`p-2 rounded-lg ${bgMuted}`}>
            {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 rounded-lg ${bgMuted}`}>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className={`md:hidden px-4 py-2 border-b space-y-1 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  activeTab === item.id ? 'bg-emerald-500/15 text-emerald-400' : textMuted
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
        {/* ================= DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
                <p className={`text-sm ${textMuted}`}>November 2026 snapshot across all accounts, budgets & bills</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTxModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition"
                >
                  <Plus className="w-4 h-4" /> Add Transaction
                </button>
              </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 rounded-2xl border ${bgCard}`}>
                <div className={`text-xs font-medium ${textMuted} flex items-center justify-between`}>
                  <span>Net Worth</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(netWorth)}</div>
                <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> Assets {formatCurrency(totalAssets)}
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${bgCard}`}>
                <div className={`text-xs font-medium ${textMuted} flex items-center justify-between`}>
                  <span>Nov Spending</span>
                  <ArrowDownRight className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(monthlySpend)}</div>
                <div className={`text-xs mt-1 ${textMuted}`}>
                  Income: <span className="text-emerald-400 font-medium">{formatCurrency(monthlyIncome)}</span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${bgCard}`}>
                <div className={`text-xs font-medium ${textMuted} flex items-center justify-between`}>
                  <span>Monthly Recurring</span>
                  <Repeat className="w-4 h-4 text-pink-400" />
                </div>
                <div className="text-2xl font-bold mt-2">{formatCurrency(monthlyRecurringTotal)}</div>
                <div className={`text-xs mt-1 ${textMuted}`}>{activeSubs.length} active subscriptions</div>
              </div>

              <div className={`p-4 rounded-2xl border ${bgCard}`}>
                <div className={`text-xs font-medium ${textMuted} flex items-center justify-between`}>
                  <span>Goals Progress</span>
                  <Target className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold mt-2">
                  {formatCurrency(data.goals.reduce((s, g) => s + g.saved, 0))}
                </div>
                <div className={`text-xs mt-1 ${textMuted}`}>
                  of {formatCurrency(data.goals.reduce((s, g) => s + g.target, 0))} target
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className={`lg:col-span-2 p-5 rounded-2xl border ${bgCard}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold">Income vs. Spending</h2>
                    <p className={`text-xs ${textMuted}`}>Monthly cash flow comparison</p>
                  </div>
                </div>
                <div className="relative h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashflowChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#e2e8f0'} />
                      <XAxis dataKey="month" stroke={dark ? '#94a3b8' : '#64748b'} fontSize={12} />
                      <YAxis stroke={dark ? '#94a3b8' : '#64748b'} fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: dark ? '#0f172a' : '#ffffff',
                          borderColor: dark ? '#334155' : '#e2e8f0',
                          borderRadius: '12px',
                        }}
                      />
                      <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Spending" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border ${bgCard}`}>
                <h2 className="font-semibold mb-1">Spending Breakdown</h2>
                <p className={`text-xs ${textMuted} mb-3`}>Current month by category</p>
                {spendingPieData.length === 0 ? (
                  <div className={`h-56 flex items-center justify-center text-sm ${textMuted}`}>No expenses this month</div>
                ) : (
                  <div className="relative h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={spendingPieData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>
                          {spendingPieData.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => formatCurrency(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Bills & Top Budgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border ${bgCard}`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Upcoming Recurring Bills</h2>
                  <button onClick={() => setActiveTab('subscriptions')} className="text-xs text-emerald-400 hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-2.5">
                  {activeSubs.slice(0, 4).map((sub) => (
                    <div key={sub.id} className={`flex items-center justify-between p-3 rounded-xl ${bgMuted}`}>
                      <div>
                        <div className="font-medium text-sm flex items-center gap-2">
                          {sub.name}
                          {sub.priceHike && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold">
                              Price Hike
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${textMuted}`}>Due {sub.nextDue} · {sub.cadence}</div>
                      </div>
                      <div className="font-semibold text-sm">{formatCurrency(sub.amount)}</div>
                    </div>
                  ))}
                  {activeSubs.length === 0 && <p className={`text-sm ${textMuted}`}>No active subscriptions.</p>}
                </div>
              </div>

              <div className={`p-5 rounded-2xl border ${bgCard}`}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Top Category Budgets</h2>
                  <button onClick={() => setActiveTab('budgets')} className="text-xs text-emerald-400 hover:underline">
                    Manage
                  </button>
                </div>
                <div className="space-y-3">
                  {data.budgets.slice(0, 4).map((b) => {
                    const spent = categorySpendMap[b.category] || 0;
                    const pct = Math.min(100, Math.round((spent / Math.max(1, b.limit)) * 100));
                    const barColor = pct >= 95 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500';
                    return (
                      <div key={b.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium">{b.category}</span>
                          <span className={textMuted}>
                            {formatCurrency(spent)} / {formatCurrency(b.limit)} ({pct}%)
                          </span>
                        </div>
                        <div className={`h-2 rounded-full overflow-hidden ${bgMuted}`}>
                          <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {data.budgets.length === 0 && <p className={`text-sm ${textMuted}`}>No budgets created yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SUBSCRIPTIONS & RECURRING ================= */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Subscriptions & Recurring Bills</h1>
                <p className={`text-sm ${textMuted}`}>
                  Monthly average: <strong className="text-emerald-400">{formatCurrency(monthlyRecurringTotal)}</strong> · Annualized:{' '}
                  <strong>{formatCurrency(monthlyRecurringTotal * 12)}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowSubModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add Recurring Bill
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 absolute left-3 top-3 ${textMuted}`} />
                <input
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  placeholder="Search subscriptions..."
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none ${inputCls}`}
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {['all', 'active', 'watchlist', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSubFilter(st)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium capitalize ${
                      subFilter === st ? 'bg-emerald-600 text-white' : `${bgMuted} ${textMuted}`
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubs.map((sub) => (
                <div key={sub.id} className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${bgCard}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {sub.name}
                        {sub.priceHike && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold">
                            Price Hike Alert
                          </span>
                        )}
                      </div>
                      <div className={`text-xs mt-0.5 ${textMuted} flex items-center gap-2`}>
                        <Calendar className="w-3.5 h-3.5" /> Next due: {sub.nextDue} · {sub.cadence}
                      </div>
                      {sub.notes && <div className={`text-xs mt-1.5 ${textMuted}`}>{sub.notes}</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(sub.amount)}</div>
                      <span
                        className={`inline-block text-[11px] px-2 py-0.5 rounded-full capitalize ${
                          sub.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : sub.status === 'watchlist'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 gap-2 flex-wrap">
                    <div className="flex gap-1.5">
                      {sub.status !== 'watchlist' && sub.status !== 'cancelled' && (
                        <button
                          onClick={() => updateSubStatus(sub.id, 'watchlist')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium ${bgMuted} hover:opacity-80`}
                        >
                          Flag Watchlist
                        </button>
                      )}
                      {sub.status !== 'cancelled' ? (
                        <button
                          onClick={() => setCancelGuideSub(sub)}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-500/15 text-rose-400 hover:bg-rose-500/25"
                        >
                          Cancel Checklist
                        </button>
                      ) : (
                        <button
                          onClick={() => updateSubStatus(sub.id, 'active')}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400"
                        >
                          Reactivate
                        </button>
                      )}
                    </div>
                    <button onClick={() => deleteSubscription(sub.id)} className={`p-1.5 rounded-lg ${textMuted} hover:text-rose-400`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {filteredSubs.length === 0 && (
                <div className={`col-span-full p-8 rounded-2xl border text-center ${bgCard} ${textMuted}`}>
                  No subscriptions match your filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= BUDGETS ================= */}
        {activeTab === 'budgets' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Unlimited Custom Budgets</h1>
                <p className={`text-sm ${textMuted}`}>
                  Total budgeted: {formatCurrency(data.budgets.reduce((s, b) => s + b.limit, 0))} · Spent so far:{' '}
                  {formatCurrency(data.budgets.reduce((s, b) => s + (categorySpendMap[b.category] || 0), 0))}
                </p>
              </div>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add / Edit Budget
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.budgets.map((b) => {
                const spent = categorySpendMap[b.category] || 0;
                const remaining = b.limit - spent;
                const pct = Math.min(100, Math.round((spent / Math.max(1, b.limit)) * 100));
                const barColor = pct >= 95 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-emerald-500';
                return (
                  <div key={b.id} className={`p-5 rounded-2xl border space-y-3 ${bgCard}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[b.category] || '#10b981' }}
                          />
                          {b.category}
                        </div>
                        {b.rollover && (
                          <span className="text-[11px] text-indigo-400 font-medium">Rollover enabled</span>
                        )}
                      </div>
                      <button onClick={() => deleteBudget(b.id)} className={`p-1 rounded-lg ${textMuted} hover:text-rose-400`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1.5">
                        <span>{formatCurrency(spent)} spent</span>
                        <span className={textMuted}>of {formatCurrency(b.limit)}</span>
                      </div>
                      <div className={`h-2.5 rounded-full overflow-hidden ${bgMuted}`}>
                        <div className={`h-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className={remaining < 0 ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-medium'}>
                        {remaining < 0 ? `${formatCurrency(Math.abs(remaining))} over budget` : `${formatCurrency(remaining)} left`}
                      </span>
                      <span className={textMuted}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
              {data.budgets.length === 0 && (
                <div className={`col-span-full p-8 rounded-2xl border text-center ${bgCard} ${textMuted}`}>
                  No budgets yet. Click "Add / Edit Budget" to create unlimited custom categories.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TRANSACTIONS ================= */}
        {activeTab === 'transactions' && (
          <div className="space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Transactions & Rules</h1>
                <p className={`text-sm ${textMuted}`}>Import CSV statements, split transactions, and run auto-categorization rules</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowRulesModal(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${bgMuted} hover:opacity-80`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> Rules ({data.rules.length})
                </button>
                <label className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer ${bgMuted} hover:opacity-80`}>
                  <Upload className="w-3.5 h-3.5 text-emerald-400" /> Import CSV
                  <input type="file" accept=".csv" onChange={handleCsvImport} className="hidden" />
                </label>
                <button
                  onClick={handleCsvExport}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${bgMuted} hover:opacity-80`}
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <button
                  onClick={() => setShowTxModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
                >
                  <Plus className="w-4 h-4" /> Add Transaction
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 absolute left-3 top-3 ${textMuted}`} />
                <input
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  placeholder="Search merchant or notes..."
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none ${inputCls}`}
                />
              </div>
              <select
                value={txCategoryFilter}
                onChange={(e) => setTxCategoryFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl border text-sm outline-none ${inputCls}`}
              >
                <option value="All">All Categories</option>
                {['Income', ...DEFAULT_CATEGORIES].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={txTypeFilter}
                onChange={(e) => setTxTypeFilter(e.target.value)}
                className={`px-3 py-2 rounded-xl border text-sm outline-none ${inputCls}`}
              >
                <option value="all">All Types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${bgCard}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`text-xs uppercase ${bgMuted} ${textMuted}`}>
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Merchant</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Account</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {filteredTxs.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/20">
                        <td className={`px-4 py-3 whitespace-nowrap text-xs ${textMuted}`}>{t.date}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{t.merchant}</div>
                          {(t.notes || (t.tags && t.tags.length > 0)) && (
                            <div className={`text-xs ${textMuted} flex items-center gap-1.5 mt-0.5 flex-wrap`}>
                              {t.tags?.map((tag) => (
                                <span key={tag} className="px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400 text-[10px]">
                                  #{tag}
                                </span>
                              ))}
                              {t.notes && <span>{t.notes}</span>}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs px-2.5 py-1 rounded-full ${bgMuted}`}>{t.category}</span>
                        </td>
                        <td className={`px-4 py-3 whitespace-nowrap text-xs ${textMuted}`}>{t.account}</td>
                        <td
                          className={`px-4 py-3 whitespace-nowrap text-right font-semibold ${
                            t.amount >= 0 ? 'text-emerald-400' : ''
                          }`}
                        >
                          {t.amount >= 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            onClick={() => openSplitModal(t)}
                            className={`p-1.5 rounded-lg ${textMuted} hover:text-indigo-400`}
                            title="Split Transaction"
                          >
                            <Scissors className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                transactions: prev.transactions.filter((x) => x.id !== t.id),
                              }));
                              showToast('Deleted transaction');
                            }}
                            className={`p-1.5 rounded-lg ${textMuted} hover:text-rose-400`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTxs.length === 0 && (
                      <tr>
                        <td colSpan={6} className={`px-4 py-8 text-center ${textMuted}`}>
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= NET WORTH ================= */}
        {activeTab === 'networth' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Net Worth Tracker</h1>
                <p className={`text-sm ${textMuted}`}>Assets minus liabilities across all linked or manual accounts</p>
              </div>
              <button
                onClick={() => setShowAccountModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add Account
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-2xl border ${bgCard}`}>
                <div className={`text-xs ${textMuted}`}>Total Net Worth</div>
                <div className="text-2xl font-bold mt-1 text-emerald-400">{formatCurrency(netWorth)}</div>
              </div>
              <div className={`p-4 rounded-2xl border ${bgCard}`}>
                <div className={`text-xs ${textMuted}`}>Total Assets</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(totalAssets)}</div>
              </div>
              <div className={`p-4 rounded-2xl border ${bgCard}`}>
                <div className={`text-xs ${textMuted}`}>Total Liabilities</div>
                <div className="text-2xl font-bold mt-1 text-rose-400">{formatCurrency(totalLiabilities)}</div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${bgCard}`}>
              <h2 className="font-semibold mb-3">6-Month Net Worth Trend</h2>
              <div className="relative h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={netWorthChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="month" stroke={dark ? '#94a3b8' : '#64748b'} fontSize={12} />
                    <YAxis stroke={dark ? '#94a3b8' : '#64748b'} fontSize={12} />
                    <Tooltip
                      formatter={(v) => formatCurrency(v)}
                      contentStyle={{
                        backgroundColor: dark ? '#0f172a' : '#ffffff',
                        borderColor: dark ? '#334155' : '#e2e8f0',
                        borderRadius: '12px',
                      }}
                    />
                    <Area type="monotone" dataKey="NetWorth" stroke="#10b981" fill="#10b98133" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-5 rounded-2xl border space-y-3 ${bgCard}`}>
                <h3 className="font-semibold flex items-center gap-2 text-emerald-400">
                  <Wallet className="w-4 h-4" /> Assets
                </h3>
                {data.accounts
                  .filter((a) => a.type === 'asset')
                  .map((a) => (
                    <div key={a.id} className={`flex items-center justify-between p-3 rounded-xl ${bgMuted}`}>
                      <div>
                        <div className="font-medium text-sm">{a.name}</div>
                        <div className={`text-xs ${textMuted}`}>{a.institution} · {a.subtype}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{formatCurrency(a.balance)}</span>
                        <button
                          onClick={() =>
                            setData((prev) => ({ ...prev, accounts: prev.accounts.filter((x) => x.id !== a.id) }))
                          }
                          className={`${textMuted} hover:text-rose-400`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 ${bgCard}`}>
                <h3 className="font-semibold flex items-center gap-2 text-rose-400">
                  <CreditCard className="w-4 h-4" /> Liabilities
                </h3>
                {data.accounts
                  .filter((a) => a.type === 'liability')
                  .map((a) => (
                    <div key={a.id} className={`flex items-center justify-between p-3 rounded-xl ${bgMuted}`}>
                      <div>
                        <div className="font-medium text-sm">{a.name}</div>
                        <div className={`text-xs ${textMuted}`}>{a.institution} · {a.subtype}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-rose-400">-{formatCurrency(a.balance)}</span>
                        <button
                          onClick={() =>
                            setData((prev) => ({ ...prev, accounts: prev.accounts.filter((x) => x.id !== a.id) }))
                          }
                          className={`${textMuted} hover:text-rose-400`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= GOALS ================= */}
        {activeTab === 'goals' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">Financial Goals</h1>
                <p className={`text-sm ${textMuted}`}>Track emergency funds, travel, and debt-payoff milestones</p>
              </div>
              <button
                onClick={() => setShowGoalModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> New Goal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.goals.map((g) => {
                const pct = Math.min(100, Math.round((g.saved / Math.max(1, g.target)) * 100));
                return (
                  <div key={g.id} className={`p-5 rounded-2xl border space-y-4 ${bgCard}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{g.name}</h3>
                        <p className={`text-xs ${textMuted}`}>Target date: {g.targetDate}</p>
                      </div>
                      <button
                        onClick={() => setData((prev) => ({ ...prev, goals: prev.goals.filter((x) => x.id !== g.id) }))}
                        className={`${textMuted} hover:text-rose-400`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1.5">
                        <span className="text-emerald-400">{formatCurrency(g.saved)}</span>
                        <span className={textMuted}>{formatCurrency(g.target)}</span>
                      </div>
                      <div className={`h-2.5 rounded-full overflow-hidden ${bgMuted}`}>
                        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className={`text-xs mt-1.5 flex justify-between ${textMuted}`}>
                        <span>{pct}% funded</span>
                        <span>+{formatCurrency(g.monthlyContribution)}/mo plan</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => contributeToGoal(g.id, 100)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-medium ${bgMuted} hover:opacity-80`}
                      >
                        +$100
                      </button>
                      <button
                        onClick={() => contributeToGoal(g.id, g.monthlyContribution || 250)}
                        className="flex-1 py-1.5 rounded-xl text-xs font-medium bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                      >
                        +Monthly ({formatCurrency(g.monthlyContribution || 250)})
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODALS ================= */}
      {/* Add Subscription Modal */}
      {showSubModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubscription} className={`w-full max-w-md p-5 rounded-2xl border space-y-4 ${bgCard}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Add Recurring Subscription</h3>
              <button type="button" onClick={() => setShowSubModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <input required placeholder="Service name (e.g., Hulu)" value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" step="0.01" placeholder="Amount ($)" value={subForm.amount} onChange={(e) => setSubForm({ ...subForm, amount: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
              <select value={subForm.cadence} onChange={(e) => setSubForm({ ...subForm, cadence: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`}>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={subForm.nextDue} onChange={(e) => setSubForm({ ...subForm, nextDue: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
              <select value={subForm.category} onChange={(e) => setSubForm({ ...subForm, category: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`}>
                {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <input placeholder="Notes (optional)" value={subForm.notes} onChange={(e) => setSubForm({ ...subForm, notes: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
              Save Subscription
            </button>
          </form>
        </div>
      )}

      {/* Cancel Checklist Modal */}
      {cancelGuideSub && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-5 rounded-2xl border space-y-4 ${bgCard}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Cancel {cancelGuideSub.name}</h3>
              <button onClick={() => setCancelGuideSub(null)}><X className="w-4 h-4" /></button>
            </div>
            <p className={`text-xs ${textMuted}`}>
              You'll save <strong>{formatCurrency(monthlyEquivalent(cancelGuideSub.amount, cancelGuideSub.cadence) * 12)}/year</strong> by cancelling before {cancelGuideSub.nextDue}.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Log into {cancelGuideSub.name} billing settings</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Save confirmation number or email receipt</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Mark as cancelled below to update your forecast</li>
            </ul>
            <div className="flex gap-2">
              <button onClick={() => setCancelGuideSub(null)} className={`flex-1 py-2 rounded-xl text-sm ${bgMuted}`}>Close</button>
              <button
                onClick={() => {
                  updateSubStatus(cancelGuideSub.id, 'cancelled');
                  setCancelGuideSub(null);
                }}
                className="flex-1 py-2 rounded-xl text-sm bg-rose-600 hover:bg-rose-500 text-white font-medium"
              >
                Mark Cancelled
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAddBudget} className={`w-full max-w-md p-5 rounded-2xl border space-y-4 ${bgCard}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Add or Update Budget</h3>
              <button type="button" onClick={() => setShowBudgetModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <input
              required
              list="budget-cats"
              placeholder="Category name"
              value={budgetForm.category}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`}
            />
            <datalist id="budget-cats">
              {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
            <input
              required
              type="number"
              step="1"
              placeholder="Monthly Limit ($)"
              value={budgetForm.limit}
              onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
              className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`}
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={budgetForm.rollover}
                onChange={(e) => setBudgetForm({ ...budgetForm, rollover: e.target.checked })}
              />
              Enable unused budget rollover
            </label>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
              Save Budget
            </button>
          </form>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAddTransaction} className={`w-full max-w-md p-5 rounded-2xl border space-y-3.5 ${bgCard}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Add Manual Transaction</h3>
              <button type="button" onClick={() => setShowTxModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setTxForm({ ...txForm, type: 'expense' })} className={`py-2 rounded-xl text-xs font-medium ${txForm.type === 'expense' ? 'bg-rose-600 text-white' : bgMuted}`}>
                Expense
              </button>
              <button type="button" onClick={() => setTxForm({ ...txForm, type: 'income' })} className={`py-2 rounded-xl text-xs font-medium ${txForm.type === 'income' ? 'bg-emerald-600 text-white' : bgMuted}`}>
                Income
              </button>
            </div>
            <input required placeholder="Merchant / Payee" value={txForm.merchant} onChange={(e) => setTxForm({ ...txForm, merchant: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" step="0.01" placeholder="Amount ($)" value={txForm.amount} onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
              <input type="date" value={txForm.date} onChange={(e) => setTxForm({ ...txForm, date: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            </div>
            {txForm.type === 'expense' && (
              <select value={txForm.category} onChange={(e) => setTxForm({ ...txForm, category: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`}>
                {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            <input placeholder="Tags (comma-separated)" value={txForm.tags} onChange={(e) => setTxForm({ ...txForm, tags: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            <input placeholder="Notes (optional)" value={txForm.notes} onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
              Save Transaction
            </button>
          </form>
        </div>
      )}

      {/* Split Transaction Modal */}
      {splitTx && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-5 rounded-2xl border space-y-4 ${bgCard}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Split: {splitTx.merchant} ({formatCurrency(Math.abs(splitTx.amount))})</h3>
              <button onClick={() => setSplitTx(null)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2.5">
              {splitParts.map((part, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <select
                    value={part.category}
                    onChange={(e) => {
                      const next = [...splitParts];
                      next[idx].category = e.target.value;
                      setSplitParts(next);
                    }}
                    className={`px-3 py-2 rounded-xl border text-sm ${inputCls}`}
                  >
                    {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={part.amount}
                    onChange={(e) => {
                      const next = [...splitParts];
                      next[idx].amount = e.target.value;
                      setSplitParts(next);
                    }}
                    className={`px-3 py-2 rounded-xl border text-sm ${inputCls}`}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleConfirmSplit}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium"
            >
              Confirm Split
            </button>
          </div>
        </div>
      )}

      {/* Auto-Categorization Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-5 rounded-2xl border space-y-4 ${bgCard}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Transaction Auto-Rules</h3>
              <button onClick={() => setShowRulesModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddRule} className="flex gap-2">
              <input required placeholder="Merchant contains..." value={ruleForm.keyword} onChange={(e) => setRuleForm({ ...ruleForm, keyword: e.target.value })} className={`flex-1 px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
              <select value={ruleForm.category} onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value })} className={`px-2.5 py-2 rounded-xl border text-sm ${inputCls}`}>
                {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium">Add</button>
            </form>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {data.rules.map((r) => (
                <div key={r.id} className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs ${bgMuted}`}>
                  <span>"{r.keyword}" → <strong>{r.category}</strong></span>
                  <button onClick={() => setData((prev) => ({ ...prev, rules: prev.rules.filter((x) => x.id !== r.id) }))} className="text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={applyAllRules} className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium">
              Apply Rules to Existing Transactions
            </button>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAddAccount} className={`w-full max-w-md p-5 rounded-2xl border space-y-3.5 ${bgCard}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Add Asset or Liability</h3>
              <button type="button" onClick={() => setShowAccountModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <input required placeholder="Account Name" value={accountForm.name} onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            <div className="grid grid-cols-2 gap-3">
              <select value={accountForm.type} onChange={(e) => setAccountForm({ ...accountForm, type: e.target.value })} className={`px-3 py-2 rounded-xl border text-sm ${inputCls}`}>
                <option value="asset">Asset</option>
                <option value="liability">Liability</option>
              </select>
              <input required type="number" step="0.01" placeholder="Balance ($)" value={accountForm.balance} onChange={(e) => setAccountForm({ ...accountForm, balance: e.target.value })} className={`px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            </div>
            <input placeholder="Institution (e.g., Chase, Vanguard)" value={accountForm.institution} onChange={(e) => setAccountForm({ ...accountForm, institution: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
              Save Account
            </button>
          </form>
        </div>
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={handleAddGoal} className={`w-full max-w-md p-5 rounded-2xl border space-y-3.5 ${bgCard}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Create Financial Goal</h3>
              <button type="button" onClick={() => setShowGoalModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <input required placeholder="Goal Name (e.g., House Down Payment)" value={goalForm.name} onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })} className={`w-full px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            <div className="grid grid-cols-2 gap-3">
              <input required type="number" placeholder="Target ($)" value={goalForm.target} onChange={(e) => setGoalForm({ ...goalForm, target: e.target.value })} className={`px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
              <input type="number" placeholder="Saved So Far ($)" value={goalForm.saved} onChange={(e) => setGoalForm({ ...goalForm, saved: e.target.value })} className={`px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={goalForm.targetDate} onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })} className={`px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
              <input type="number" placeholder="Monthly Plan ($)" value={goalForm.monthlyContribution} onChange={(e) => setGoalForm({ ...goalForm, monthlyContribution: e.target.value })} className={`px-3 py-2 rounded-xl border text-sm ${inputCls}`} />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium">
              Create Goal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}