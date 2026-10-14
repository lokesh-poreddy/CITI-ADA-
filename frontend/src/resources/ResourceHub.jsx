import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, Bookmark, BookmarkCheck, BookOpen, BriefcaseBusiness, Check,
  Code2, ExternalLink, GraduationCap, Landmark, Search, ShieldCheck, SlidersHorizontal,
  Sparkles, Wrench, X,
} from 'lucide-react';
import { RESOURCE_CATALOG, RESOURCE_CATEGORIES, RESOURCE_COPY, filterResources } from './resourceCatalog.js';
import './resource-hub.css';

const STORAGE_KEY = 'udaan.resourceBookmarks.v1';
const ICONS = {
  coding: Code2, school: BookOpen, courses: GraduationCap, skills: Wrench,
  exams: GraduationCap, careers: BriefcaseBusiness, aid: Landmark, all: Sparkles,
};
const PROVIDER_LABEL_KEY = {
  government: 'official', institution: 'official', publisher: 'publisher',
  documentation: 'documentation', community: 'community', 'official-docs': 'documentation',
};
const LOCALE_TAG = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN' };

function loadBookmarks() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export default function ResourceHub({ language = 'en', initialCategory = 'all', onBuildPathway }) {
  const t = RESOURCE_COPY[language] || RESOURCE_COPY.en;
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [savedIds, setSavedIds] = useState(loadBookmarks);
  const [savedOnly, setSavedOnly] = useState(false);
  const [saveNotice, setSaveNotice] = useState('');

  useEffect(() => {
    if (RESOURCE_CATEGORIES.some((item) => item.id === initialCategory)) setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    try { globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(savedIds)); } catch { /* bookmark feature degrades gracefully */ }
  }, [savedIds]);

  const filtered = useMemo(() => filterResources(RESOURCE_CATALOG, {
    query, category, savedIds, audience: savedOnly ? 'saved' : 'all',
  }), [query, category, savedIds, savedOnly]);

  const toggleBookmark = (resource) => {
    const isSaved = savedIds.includes(resource.id);
    setSavedIds((previous) => isSaved ? previous.filter((id) => id !== resource.id) : [...previous, resource.id]);
    setSaveNotice(isSaved ? t.unsave : t.save);
  };

  const formatDate = (value) => {
    const date = new Date(`${value}T12:00:00`);
    if (Number.isNaN(date.valueOf())) return value;
    return new Intl.DateTimeFormat(LOCALE_TAG[language] || 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  return (
    <section className="resource-hub" id="resource-hub" aria-labelledby="resource-hub-title">
      <div className="container">
        <div className="resource-hub__heading">
          <div>
            <span className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</span>
            <h2 id="resource-hub-title">{t.title}</h2>
            <p>{t.intro}</p>
          </div>
          <div className="resource-hub__seal" aria-label={t.local}>
            <BookOpen size={23} />
            <strong>{RESOURCE_CATALOG.length}</strong>
            <span>{t.countLabel}</span>
          </div>
        </div>

        <div className="resource-search-panel">
          <label className="resource-search" htmlFor="resource-query">
            <Search size={20} aria-hidden="true" />
            <span className="sr-only">{t.searchLabel}</span>
            <input id="resource-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} autoComplete="off" />
            {query && <button type="button" className="resource-search__clear" onClick={() => setQuery('')} aria-label={t.clear}><X size={17} /></button>}
          </label>
          <div className="resource-search-panel__meta">
            <span><ShieldCheck size={15} />{t.local}</span>
            <span><SlidersHorizontal size={15} />{t.lowData}</span>
          </div>
        </div>

        <div className="resource-category-row" aria-label={t.categoriesTitle}>
          {RESOURCE_CATEGORIES.map((item) => {
            const Icon = ICONS[item.id] || BookOpen;
            return <button key={item.id} type="button" className={`resource-category ${category === item.id ? 'is-active' : ''}`} onClick={() => setCategory(item.id)} aria-pressed={category === item.id}>
              <Icon size={16} /><span>{t[item.labelKey]}</span>{category === item.id && <Check size={14} />}
            </button>;
          })}
        </div>

        <div className="resource-results-bar">
          <div><strong>{filtered.length}</strong> {t.results}<span className="resource-results-bar__dot">·</span><span>{savedIds.length} {t.saved.toLocaleLowerCase(language === 'te' ? 'te-IN' : language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN')}</span></div>
          <div className="resource-results-bar__actions">
            <button type="button" className={`resource-toggle ${savedOnly ? 'is-active' : ''}`} onClick={() => setSavedOnly((value) => !value)} aria-pressed={savedOnly}>
              <Bookmark size={15} />{savedOnly ? t.allLinks : t.savedOnly}
            </button>
            <button type="button" className="resource-clear" onClick={() => { setQuery(''); setCategory('all'); setSavedOnly(false); }}>{t.clear}</button>
          </div>
        </div>

        {filtered.length ? <div className="resource-grid">
          {filtered.map((resource) => {
            const Icon = ICONS[resource.category] || BookOpen;
            const bookmarked = savedIds.includes(resource.id);
            const providerType = t[PROVIDER_LABEL_KEY[resource.publisherType] || 'publisher'];
            return <article className="resource-card" key={resource.id}>
              <div className="resource-card__top">
                <span className={`resource-card__icon resource-card__icon--${resource.category}`}><Icon size={21} /></span>
                <span className={`resource-kind resource-kind--${resource.publisherType === 'government' || resource.publisherType === 'institution' ? 'official' : 'other'}`}>
                  {(resource.publisherType === 'government' || resource.publisherType === 'institution') && <ShieldCheck size={12} />}{providerType}
                </span>
                <button type="button" className={`resource-bookmark ${bookmarked ? 'is-saved' : ''}`} onClick={() => toggleBookmark(resource)} aria-label={`${bookmarked ? t.unsave : t.save}: ${resource.title}`} aria-pressed={bookmarked}>
                  {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                </button>
              </div>
              <div className="resource-card__body">
                <span className="resource-card__category">{t[resource.category] || t.all}</span>
                <h3>{resource.title}</h3>
                <p className="resource-card__provider">{resource.provider}</p>
                <p className="resource-card__description">{resource.description}</p>
                <div className="resource-card__level"><span>{t.level}</span><strong>{resource.level}</strong></div>
                <div className="resource-card__tags" aria-label={t.topics}>{resource.topics.slice(0, 4).map((topic) => <span key={topic}>{topic}</span>)}</div>
                <details className="resource-card__details">
                  <summary>{t.access}</summary>
                  <p>{resource.accessNote}</p>
                  <p><span>{t.checked}: </span><time dateTime={resource.checkedOn}>{formatDate(resource.checkedOn)}</time></p>
                </details>
              </div>
              <div className="resource-card__footer">
                <a href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.open}: ${resource.title} (${t.openNewTab})`}>
                  {t.open}<ArrowUpRight size={16} />
                </a>
                <span><ExternalLink size={13} />{t.external}</span>
              </div>
            </article>;
          })}
        </div> : <div className="resource-empty" role="status">
          <Search size={25} /><h3>{savedOnly && savedIds.length === 0 ? t.emptySaved : t.noResults}</h3><p>{savedOnly && savedIds.length === 0 ? t.emptySavedText : t.noResultsText}</p>
          <button type="button" className="button button--primary" onClick={() => { setQuery(''); setCategory('all'); setSavedOnly(false); }}>{t.clear}</button>
        </div>}

        <div className="resource-hub__footnote">
          <div className="resource-hub__footnote-icon"><ShieldCheck size={19} /></div>
          <div><h3>{t.curationTitle}</h3><p>{t.curationText}</p><p className="resource-hub__footnote-small">{t.disclaimer}</p><p className="resource-hub__footnote-small">{t.noPromise}</p></div>
        </div>
        {saveNotice && <span aria-live="polite" className="sr-only">{saveNotice}</span>}
        {onBuildPathway && <div className="resource-hub__pathfinder"><span><Sparkles size={18} />{t.pathfinder}</span><button type="button" className="button button--secondary" onClick={onBuildPathway}>{t.pathfinder}<ArrowUpRight size={16} /></button></div>}
      </div>
    </section>
  );
}
