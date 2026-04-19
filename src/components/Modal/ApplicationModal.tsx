import { useState, useEffect, useRef } from 'react';
import type { JobApplication, ColumnType } from '../../types';
import { COLUMNS, INBOX_COLUMN } from '../../constants';
import styles from './Modal.module.css';

interface Props {
  app: JobApplication | null;
  defaultStatus: ColumnType;
  onSave: (app: JobApplication) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

const COMMON_COMPANIES = [
  '字节跳动', '阿里巴巴', '腾讯', '百度', '美团', '京东', '拼多多', '网易',
  '华为', '小米', 'OPPO', 'vivo', '大疆', '比亚迪', '蔚来', '小鹏',
  '快手', 'B站', '滴滴', '携程', '蚂蚁集团', '微软', 'Google', 'Apple',
  'Amazon', 'Meta', '三星', 'Intel', 'NVIDIA', 'AMD',
  '商汤', '旷视', '依图', 'Moonshot', '智谱AI', '百川智能',
  '招商银行', '中信证券', '平安科技', '微众银行',
];

const LOCATION_RE = /^(?:北京|上海|广州|深圳|杭州|成都|武汉|南京|西安|重庆|苏州|天津|长沙|郑州|东莞|青岛|合肥|佛山|宁波|厦门|大连|福州|无锡|济南|哈尔滨|沈阳|昆明|珠海|中山|惠州|海口|三亚|贵阳|太原|石家庄|兰州|南宁|乌鲁木齐|呼和浩特|全国|远程|不限|线上)/;
const SKIP_RE = /^(?:正式|实习|全职|兼职|研发|产品|产品类|设计|运营|市场|销售|职位\s*ID|编号|发布|更新|更新时间|立即投递|已投递|申请|收藏|分享|举报|在线|活跃|今日|昨日|本周|热招|急聘|最新|\d+人|沟通过|感兴趣|投递简历|看过|基础信息|招聘批次|毕业|部门[：:]|工作经验|实习-)/;

function parseJobText(text: string): Partial<JobApplication> {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let position = '';
  let location = '';
  let jobDescription = '';
  let requirements = '';
  let url = '';

  const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
  if (urlMatch) url = urlMatch[1];

  // Explicit "工作地点" label — only this, NOT "面试地点"
  const workLocationMatch = text.match(/工作地[点址][：:]\s*(.+)/);
  if (workLocationMatch) {
    location = workLocationMatch[1].trim();
  }

  // Position from explicit label
  const positionLabel = text.match(/(?:岗位|职位)[名称]*[：:]\s*(.+)/);
  if (positionLabel) position = positionLabel[1].trim();

  // Heuristic: first meaningful line is position title
  if (!position) {
    for (const line of lines.slice(0, 5)) {
      if (line.match(/^https?:\/\//) || SKIP_RE.test(line)) continue;
      if (LOCATION_RE.test(line) && line.length <= 20) continue;
      if (/^\d+[-–~]\d+\s*[Kk万]/.test(line)) continue;
      if (line.length > 50) continue;
      position = line;
      break;
    }
  }

  // Fallback location from standalone city line (only if no explicit label found)
  if (!location) {
    for (const line of lines.slice(0, 10)) {
      if (LOCATION_RE.test(line) && line.length <= 20) {
        location = line;
        break;
      }
    }
  }

  // Section-based parsing: find all section headers at line start and split by position
  const sectionHeaders = [
    { re: /^(?:职位描述|工作内容|岗位职责|工作职责|Job\s*Description)/im, type: 'desc' },
    { re: /^(?:职位要求|任职要求|岗位要求|岗位基本要求|任职资格|Job\s*Requirements|招聘要求)/im, type: 'req' },
    { re: /^(?:岗位亮点|具备以下条件|加分项)/im, type: 'skip' },
  ];

  type Section = { type: string; start: number; end: number };
  const sections: Section[] = [];
  for (const { re, type } of sectionHeaders) {
    const m = text.match(re);
    if (m && m.index !== undefined) {
      const contentStart = m.index + m[0].length;
      sections.push({ type, start: contentStart, end: text.length });
    }
  }
  sections.sort((a, b) => a.start - b.start);
  for (let i = 0; i < sections.length - 1; i++) {
    sections[i].end = sections[i + 1].start;
  }

  function extractNumberedItems(raw: string): string {
    const items = raw.split('\n').map((l) => l.trim()).filter((l) => /^[0-9]+[、.）)]/.test(l));
    return items.length >= 2 ? items.join('\n') : raw.trim();
  }

  for (const sec of sections) {
    const content = text.slice(sec.start, sec.end).replace(/^[：:\s]+/, '').trim();
    if (content.length < 10) continue;
    if (sec.type === 'desc' && !jobDescription) {
      jobDescription = extractNumberedItems(content);
    } else if (sec.type === 'req' && !requirements) {
      requirements = extractNumberedItems(content);
    }
  }

  return { position, location, url, jobDescription, requirements };
}

export function ApplicationModal({ app, defaultStatus, onSave, onDelete, onClose }: Props) {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ColumnType>(defaultStatus);
  const [url, setUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [notes, setNotes] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [showCompanyList, setShowCompanyList] = useState(false);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const companyRef = useRef<HTMLDivElement>(null);
  const isNew = !app;

  useEffect(() => {
    if (app) {
      setCompany(app.company);
      setPosition(app.position);
      setLocation(app.location || '');
      setDeadline(app.deadline);
      setStatus(app.status);
      setUrl(app.url || '');
      setJobDescription(app.jobDescription || '');
      setRequirements(app.requirements || '');
      setNotes(app.notes);
    }
  }, [app]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setShowCompanyList(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCompanyInput = (val: string) => {
    setCompany(val);
    if (val.trim()) {
      const filtered = COMMON_COMPANIES.filter((c) => c.toLowerCase().includes(val.toLowerCase()));
      setCompanyFilter(filtered);
      setShowCompanyList(filtered.length > 0);
    } else {
      setCompanyFilter(COMMON_COMPANIES);
      setShowCompanyList(true);
    }
  };

  const handleParse = () => {
    if (!pasteText.trim()) return;
    const info = parseJobText(pasteText);
    if (info.position) setPosition(info.position);
    if (info.location) setLocation(info.location);
    if (info.url) setUrl(info.url);
    if (info.jobDescription) setJobDescription(info.jobDescription);
    if (info.requirements) setRequirements(info.requirements);
    setPasteText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !position.trim()) return;
    const now = new Date().toISOString();
    onSave({
      id: app?.id || crypto.randomUUID(),
      company: company.trim(),
      position: position.trim(),
      location: location.trim(),
      deadline,
      status,
      url: url.trim(),
      jobDescription: jobDescription.trim(),
      requirements: requirements.trim(),
      notes: notes.trim(),
      createdAt: app?.createdAt || now,
      updatedAt: now,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{app ? '编辑申请' : '新增申请'}</h2>

        {isNew && (
          <div className={styles.pasteSection}>
            <textarea
              className={styles.pasteArea}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={'粘贴招聘信息，点击「智能识别」自动填入下方表单\n\n自动识别：岗位名、工作地点、工作内容、任职要求\n公司名称需手动选择或输入'}
              rows={5}
            />
            <button type="button" className={styles.importBtn} onClick={handleParse} disabled={!pasteText.trim()}>
              智能识别
            </button>
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field} ref={companyRef}>
              <label className={styles.label}>公司名称 <span className={styles.required}>*</span></label>
              <input
                className={styles.input}
                value={company}
                onChange={(e) => handleCompanyInput(e.target.value)}
                onFocus={() => { setCompanyFilter(company ? COMMON_COMPANIES.filter((c) => c.toLowerCase().includes(company.toLowerCase())) : COMMON_COMPANIES); setShowCompanyList(true); }}
                placeholder="输入或选择公司"
                required
                autoComplete="off"
              />
              {showCompanyList && companyFilter.length > 0 && (
                <div className={styles.dropdown}>
                  {companyFilter.map((c) => (
                    <div key={c} className={styles.dropdownItem} onMouseDown={() => { setCompany(c); setShowCompanyList(false); }}>
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>岗位名称 <span className={styles.required}>*</span></label>
              <input className={styles.input} value={position} onChange={(e) => setPosition(e.target.value)} placeholder="如：前端开发实习" required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>工作地点</label>
              <input className={styles.input} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="如：北京" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>截止日期</label>
              <input className={styles.input} type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>当前阶段</label>
              <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as ColumnType)}>
                <option key={INBOX_COLUMN.id} value={INBOX_COLUMN.id}>{INBOX_COLUMN.title}</option>
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>职位链接</label>
              <input className={styles.input} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="可选" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>工作内容</label>
            <textarea className={styles.textarea} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="岗位职责、工作内容..." rows={3} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>任职要求</label>
            <textarea className={styles.textarea} value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="学历、技能、经验要求..." rows={3} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>备注</label>
            <textarea className={styles.textarea} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="面试时间、联系人等..." rows={2} />
          </div>
          <div className={styles.footer}>
            {app && onDelete && (
              <button type="button" className={styles.deleteBtn} onClick={() => { if (confirm('确定删除这条申请？')) onDelete(app.id); }}>删除</button>
            )}
            <button type="button" className={styles.cancelBtn} onClick={onClose}>取消</button>
            <button type="submit" className={styles.submitBtn}>{app ? '保存' : '添加'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
