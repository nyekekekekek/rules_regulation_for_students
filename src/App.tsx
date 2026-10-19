import { useEffect, useState, type CSSProperties } from 'react'
import './App.css'

type Language = 'en' | 'ceb' | 'maoy'
type Theme = 'green' | 'blue' | 'violet' | 'maroon'
type Rule = { title: string; details: string; points?: string[] }
const themes: { id: Theme; label: string }[] = [
  { id: 'green', label: 'COMLAB Gold' },
  { id: 'blue', label: 'Ocean Blue' },
  { id: 'violet', label: 'Violet' },
  { id: 'maroon', label: 'Maroon' },
]
const isTheme = (value: string | null): value is Theme => themes.some((option) => option.id === value)
const MIN_TEXT_SCALE = 0.5
const MAX_TEXT_SCALE = 2.5
const TEXT_SCALE_STEP = 0.1

const rules = [
  {
    title: 'No instructor, no class.',
    details: 'Students may use the laboratory only when an instructor is present.',
  },
  {
    title: 'Wear your school ID. No ID, no entry.',
    details: 'Students who cannot present their ID must provide the appropriate documentation:',
    points: [
      'Confiscated ID: present the violation/offense slip issued by the CSU/SAO.',
      'Lost ID: present the ID reissuance slip from the SAO.',
      'Borrowed items from another department: present the borrower’s slip from that department.',
    ],
  },
  {
    title: 'Enter only during your assigned class schedule.',
    details: 'Only students with a class scheduled in the laboratory may enter. Students and working scholars must not loiter inside the laboratory.',
  },
  {
    title: 'Store bags and water bottles on the shelves.',
    details: 'Upon entering the laboratory, place all bags and water bottles inside the designated shelves.',
  },
  {
    title: 'Observe proper decorum and dress code.',
    details: 'Maintain proper conduct inside the laboratory and follow the dress code (e.g., no caps, earrings, etc.).',
  },
  {
    title: 'No eating, drinking, or chewing gum.',
    details: 'Eating, drinking, chewing bubble gum, and similar activities are not allowed inside the laboratory.',
  },
  {
    title: 'Do not enter under the influence of alcohol.',
    details: 'Students under the influence of liquor are not allowed in the laboratory.',
  },
  {
    title: 'Use personal devices only when required.',
    details: 'Flash drives, netbooks, and other music gadgets are not allowed unless required by the instructor.',
  },
  {
    title: 'Do not charge personal gadgets.',
    details: 'Students are not allowed to charge their gadgets inside the laboratory.',
  },
  {
    title: 'Use the internet for curriculum-related work only.',
    details: 'Viewing websites that are not part of the curriculum is strictly prohibited.',
  },
  {
    title: 'Stay at your assigned computer.',
    details: 'Do not transfer to another computer unless your assigned unit malfunctions. Ask the laboratory assistant for clearance before transferring.',
  },
  {
    title: 'Sit in only with the instructor’s permission.',
    details: 'Sit-in students are allowed only during the period approved by the instructor.',
  },
  {
    title: 'Report technical problems to laboratory staff.',
    details: 'Refer any technical problem or difficulty to the laboratory supervisor or assistant.',
  },
  {
    title: 'Do not change computer files or settings.',
    details: 'Deleting or changing computer software, files, or setup is not allowed.',
  },
  {
    title: 'Do not install software or play computer games.',
    details: 'Installing software and playing computer games are strictly prohibited.',
  },
  {
    title: 'Close your applications and return your chair.',
    details: 'Before leaving the laboratory, close all application programs and return your chair to its proper place.',
  },
  {
    title: 'Use only your own login account.',
    details: 'Students must not use another student’s login account.',
  },
  {
    title: 'Respect laboratory property.',
    details: 'Vandalism is strictly prohibited. This includes damaging laboratory property or equipment and writing on walls or computer tables.',
  },
  {
    title: 'Save your work five minutes before class ends.',
    details: 'Save your projects and files at least five (5) minutes before the end of the class.',
  },
  {
    title: 'Violations will be dealt with accordingly.',
    details: 'Students who violate or refuse to follow these rules, or any provision of the Students’ Manual, will be subject to the following actions:',
    points: [
      'First offense: the student will receive a strong warning. In cases of drunkenness or vandalism, the student will be referred to the SAO for appropriate action.',
      'Second offense: the student will be asked to leave the laboratory and submit an apology letter to the teacher-in-charge and laboratory supervisor before being allowed to return.',
      'Third offense: the student’s ID will be confiscated and endorsed to the SAO for appropriate action.',
    ],
  },
  {
    title: 'Units are checked after every class.',
    details: 'After each class, all computer units will be checked for monitoring and maintenance. Following due process, students assigned to a unit may be held liable for damage or loss.',
  },
]

const translations: Record<Exclude<Language, 'en'>, Rule[]> = {
  ceb: [
    { title: 'Walay instructor? Aw, walay klase sa lab.', details: 'Makagamit ra mo sa laboratory kung naa ang instructor. Wala siya? Dili sa ta mosulod.' },
    { title: 'ID always. Walay ID, walay sulod.', details: 'Kung wala kay maipakitang ID, kinahanglan nimo ipakita ang sakto nga slip:', points: ['Na-confiscate ang ID: ipakita ang violation/offense slip gikan sa CSU/SAO.', 'Nawala ang ID: ipakita ang ID reissuance slip gikan sa SAO.', 'Nanghulam og gamit sa laing department: ipakita ang borrower’s slip nila.'] },
    { title: 'Sulod lang kung naa kay klase sa schedule.', details: 'Ang naay klase sa lab karon nga oras ra ang pwede mosulod. Dili tambayanan ang lab, students ug working scholars, ayaw pag-loiter.' },
    { title: 'Bag ug water bottle? Ibutang sa shelf.', details: 'Pag-abot, ibutang ang tanan nimong bag ug water bottle sa designated shelves una.' },
    { title: 'Chill lang, pero sundon ang decorum ug dress code.', details: 'Keep it respectful sulod sa lab, ug sundon ang dress code (pananglitan: walay cap, earrings, ug uban pa).' },
    { title: 'No food, drinks, ug chewing gum sa lab.', details: 'Bawal ang pagkaon, pag-inom, bubble gum, ug susamang snacks/drinks sulod sa laboratory. Salamat sa pagsabot.' },
    { title: 'Ayaw sulod kung nakainom og alcohol.', details: 'Kung under the influence ka sa liquor, dili ka pwede mosulod sa laboratory.' },
    { title: 'Personal gadgets, kung required ra sa instructor.', details: 'Flash drive, netbook, ug music gadgets dili pwede gawas kung gi-require sa instructor.' },
    { title: 'Ayaw pag-charge sa imong gadget diri.', details: 'Dili pwede mag-charge og personal gadgets sulod sa laboratory.' },
    { title: 'Schoolwork ra ang internet, please.', details: 'Ang pag-open og websites nga dili apil sa curriculum kay strictly prohibited.' },
    { title: 'Stay sa imong assigned computer.', details: 'Ayaw balhin og unit unless nag-malfunction imong assigned computer. Ask the lab assistant for clearance una ka mobalhin.' },
    { title: 'Sit-in? Instructor approval sa una.', details: 'Pwede ra mag-sit-in sulod sa oras nga gi-allow sa instructor.' },
    { title: 'Naay tech issue? I-report dayon.', details: 'Ipaabot ang technical problems o kalisod sa laboratory supervisor o assistant.' },
    { title: 'Ayaw hilabti ang files o computer settings.', details: 'Dili pwede mag-delete o mag-usab sa software, files, o setup sa computer.' },
    { title: 'No software installs, no computer games.', details: 'Strictly bawal ang pag-install og software ug pagdula og computer games sa lab.' },
    { title: 'Before mo hawa: close apps, ibalik ang chair.', details: 'Sirad-i ang tanang application programs ug ibalik ang lingkuranan sa saktong lugar before leaving.' },
    { title: 'Imong account ra imong gamiton.', details: 'Ayaw gamita ang login account sa laing student. Keep your account to yourself.' },
    { title: 'Respect the lab, walay vandalism.', details: 'Bawal gub-on ang gamit o property sa lab ug bawal magsulat sa walls o computer tables. Ampingi ang shared space.' },
    { title: 'Save na, five minutes before matapos ang class.', details: 'I-save ang projects ug files at least lima (5) ka minuto before matapos ang klase. Ayaw hulata ang last second.' },
    { title: 'Naay consequences ang violations.', details: 'Kung molapas o modumili og sunod niini nga rules o sa Students’ Manual, mao ni ang aksyon:', points: ['1st offense: strong warning. Kung drunkenness o vandalism, i-refer ang student sa SAO para sa appropriate action.', '2nd offense: pahawaon sa lab. Kinahanglan mosubmit og apology letter sa teacher-in-charge ug lab supervisor before tugotan nga makasulod balik.', '3rd offense: i-confiscate ang student ID ug i-endorse sa SAO para sa appropriate action.'] },
    { title: 'I-check ang units human sa matag klase.', details: 'Human sa class, i-check ang tanang units for monitoring ug maintenance. Human sa due process, ang students nga gi-assign sa unit mahimong manubag sa damage o loss.' },
  ],
  maoy: [
    { title: 'Walay instructor, walay klase, daw parehas sa crush nga wa ni-reply.', details: 'Makagamit ra sa laboratory kung naa ang instructor. Wala siya? Dili pwede mosulod, bisag mingawon pa ta sa computer.' },
    { title: 'ID sa una, bestie. Walay ID, walay sulod.', details: 'Kung dili nimo maipakita ang ID, ipakita ang sakto nga dokumento. Mas sakit ang ma-reject sa entrance kaysa ma-seen-zone:', points: ['Na-confiscate ang ID: ipakita ang violation/offense slip gikan sa CSU/SAO.', 'Nawala ang ID: ipakita ang ID reissuance slip gikan sa SAO.', 'Nanghulam og gamit sa laing department: ipakita ang borrower’s slip gikan sa maong department.'] },
    { title: 'Naa kay class sa schedule? Mao ra’y ticket nimo.', details: 'Ang naay klase sa laboratory sa oras nga gi-assign ra ang pwede mosulod. Dili tambayanan ang lab sa students o working scholars, ayaw pag-loiter, dili ni waiting area sa ex.' },
    { title: 'Bag ug water bottle, i-shelf sa, ayaw i-ghost.', details: 'Pag-abot, ibutang ang tanang bag ug water bottle sa designated shelves.' },
    { title: 'Good vibes, proper decorum, ug dress code.', details: 'Magpabiling respetado sulod sa lab ug sundon ang dress code (pananglitan: walay cap, earrings, ug uban pa). Ang outfit dili dapat ma-issue.' },
    { title: 'No food, drinks, or gum. Dili ni heartbreak snacks.', details: 'Bawal mokaon, moinom, mag-chewing gum, o magdala og susamang snacks sulod sa laboratory.' },
    { title: 'Ayaw sulod kung nakainom og alcohol.', details: 'Kung under the influence sa liquor, dili pwede mosulod sa laboratory. Dili ni time para mag-drama sa lab.' },
    { title: 'Personal gadgets? Kung gi-require ra sa instructor.', details: 'Dili pwede ang flash drive, netbook, o music gadgets gawas kung gi-require sa instructor. Dili kinahanglan i-play ang sad playlist.' },
    { title: 'Ayaw pag-charge sa imong gadget diri.', details: 'Bawal mag-charge og personal gadgets sulod sa laboratory. Pangita og saktong charging spot, dili diri.' },
    { title: 'Schoolwork ra sa internet, dili stalking sa ex.', details: 'Strictly prohibited ang pagtan-aw og websites nga dili apil sa curriculum. Stay sa class-related nga sites.' },
    { title: 'Stay sa imong assigned computer, ayaw sigeg balhin.', details: 'Ayaw balhin sa laing computer gawas kung nag-malfunction ang imong assigned unit. Pangayo una og clearance sa laboratory assistant before mobalhin.' },
    { title: 'Sit-in? Permission sa instructor una, dili basta-basta.', details: 'Pwede ra mag-sit-in sulod sa oras nga gi-allow sa instructor. Dili ni surprise visit.' },
    { title: 'Naay tech issue? I-report, ayaw hilak sa keyboard.', details: 'I-report ang technical problem o kalisod sa laboratory supervisor o assistant.' },
    { title: 'Ayaw usba ang files o settings, dili ni imong relationship status.', details: 'Bawal mag-delete o mag-usab sa computer software, files, o setup.' },
    { title: 'No software installs, no computer games. Bawal mag-install og drama.', details: 'Strictly prohibited ang pag-install og software ug pagdula og computer games sa lab.' },
    { title: 'Human na? Close apps, ibalik ang chair sa lugar.', details: 'Sa dili pa mobiya, sirad-i ang tanang application programs ug ibalik ang lingkuranan sa saktong lugar. Ayaw biya-i nga nag-inusara ang chair.' },
    { title: 'Imong login account ra, ayaw gamit sa account sa lain.', details: 'Dili pwede gamiton ang login account sa laing student. Respect their privacy, ayaw pag-access sa account sa uban.' },
    { title: 'Respect the lab. Walay vandalism, walay sakit sa ulo.', details: 'Strictly prohibited ang pagdaot sa laboratory property o equipment, ug pagsulat sa walls o computer tables. Ampingi ang gamit sa tanan.' },
    { title: 'Save imong files 5 minutes before matapos ang class.', details: 'I-save ang projects ug files labing menos lima (5) ka minuto before matapos ang klase. Ayaw paabota sa last minute, mas lisod pa na kaysa moving on.' },
    { title: 'Violations naay consequences, dili ni joke nga maoy.', details: 'Kung molapas o modumili sa pagsunod niini nga rules o sa Students’ Manual, mao ni ang aksyon:', points: ['1st offense: kusog nga warning. Kung drunkenness o vandalism, i-refer ang student sa SAO para sa appropriate action.', '2nd offense: pahawaon sa laboratory. Kinahanglan mosubmit og apology letter sa teacher-in-charge ug laboratory supervisor before tugotan nga mosulod balik.', '3rd offense: i-confiscate ang student ID ug i-endorse sa SAO para sa appropriate action.'] },
    { title: 'I-check ang units human sa matag class.', details: 'Human sa matag klase, i-check ang tanang computer units para sa monitoring ug maintenance. Human sa due process, ang students nga gi-assign sa unit mahimong manubag sa damage o loss.' },
  ],
}

const interfaceText = {
  en: { cover: 'Cover', coverTitle: 'Rules & Regulations', coverSubtitle: 'For Students', coverIntro: 'A quick guide to help everyone learn, work, and share the lab responsibly.', folderHint: 'Click the folder to open', folderReady: 'Ready when you are', folderOpen: 'Folder opened', folderCaption: 'Your guide to a better lab', startPrompt: 'Take a moment to go through each rule.', startReading: 'Start reading', rulesLabel: '21 rules', timeLabel: 'About 2 minutes', search: 'Search rules', searchPlaceholder: 'Search by rule or keyword...', borrow: 'Borrow equipment', language: 'Language', textSize: 'Text size', contrast: 'High contrast', close: 'Close', noResults: 'No matching rules', noResultsHelp: 'Try another keyword.', checkoutTitle: 'Borrowing and returning equipment', checkoutIntro: 'Ask the laboratory assistant before taking any equipment.', checkoutSteps: ['Show your student ID to the laboratory assistant in person. The app does not ask for or store your ID.', 'Tell the assistant which item you need and wait for approval before taking it.', 'Check the item with the assistant and follow the lab’s sign-out procedure.', 'Return the item directly to the assistant after use and let them confirm it is complete and in good condition.'], checkoutNote: 'Follow your laboratory’s posted checkout procedure. Availability, loan periods, and any additional requirements are set by the lab.', back: 'Back to rules', previous: 'Previous', next: 'Next rule', finish: 'Finish', progress: 'Reading progress', chooseRule: 'Choose a rule', closeSearch: 'Close rule search', sizeDown: 'Decrease text size', sizeUp: 'Increase text size', contrastToggle: 'Toggle high contrast', complete: 'Thanks for doing your part.', completeText: 'You’ve reviewed all 21 student rules. Help keep the laboratory safe, respectful, and ready for learning.', backCover: 'Back to cover', searchLabel: 'Search rules' },
  ceb: { cover: 'Balik sa sugod', coverTitle: 'Mga Lagda ug Regulasyon', coverSubtitle: 'Para sa mga Estudyante', coverIntro: 'Quick guide ni para makatuon ug makagamit ta sa lab nga responsable.', folderHint: 'I-click ang folder para ablihan', folderReady: 'Ready na? Tara!', folderOpen: 'Abli na ang folder', folderCaption: 'Guide para smooth ang lab experience', startPrompt: 'Agi-a lang ang matag lagda, dali ra ni.', startReading: 'Sugdi na', rulesLabel: '21 ka lagda', timeLabel: 'Mga 2 minutos', search: 'Search og lagda', searchPlaceholder: 'I-type ang lagda o keyword...', borrow: 'Hulam og kagamitan', language: 'Pinulongan', textSize: 'Gidak-on sa text', contrast: 'High contrast', close: 'Sirad-i', noResults: 'Walay match nga lagda', noResultsHelp: 'Sulayi og laing keyword.', checkoutTitle: 'Pag-hulam ug pag-uli sa gamit', checkoutIntro: 'Pangutana sa lab assistant una ka manghulam og gamit.', checkoutSteps: ['Ipakita in person imong student ID sa lab assistant. Dili mangayo o mag-store og ID ang app.', 'Sultihi ang assistant unsay gamit imong kinahanglan, unya hulata ang go signal before kuhaon.', 'I-check ang gamit uban sa assistant ug sundon ang sign-out process sa lab.', 'Iuli mismo sa assistant ang gamit human nimo gamiton, unya pa-confirm nga kompleto ug okay pa ang condition.'], checkoutNote: 'Sunda ang posted checkout process sa inyong lab. Ang availability, kadugayon sa hulam, ug uban pang requirements kay lab ang magbuot.', back: 'Balik sa lagda', previous: 'Balik', next: 'Sunod nga lagda', finish: 'Human na', progress: 'Progress sa pagbasa', chooseRule: 'Pilia ang lagda', closeSearch: 'Sirad-i ang search', sizeDown: 'Gamayi ang text', sizeUp: 'Padak-a ang text', contrastToggle: 'I-toggle ang high contrast', complete: 'Salamat sa pag-apil!', completeText: 'Nahuman na nimo ang 21 ka lagda. Tabang ta nga safe, respectful, ug ready-to-learn ang laboratoryo.', backCover: 'Balik sa cover', searchLabel: 'Search og lagda' },
  maoy: { cover: 'Balik sa sugod', coverTitle: 'Mga Lagda: Love Is Temporary, Rules Are Forever', coverSubtitle: 'Para sa mga Estudyante', coverIntro: 'Joke ra ang maoy vibes; seryoso gihapon ang pagsunod sa rules sa lab.', folderHint: 'I-click ang folder para ablihan', folderReady: 'Ready na? Kaya ra ni!', folderOpen: 'Abli na ang folder', folderCaption: 'Guide para walay lab heartbreak', startPrompt: 'Basaha ang matag lagda, dili ni situationship, klaro ni.', startReading: 'Sugdi na', rulesLabel: '21 ka lagda', timeLabel: 'Mga 2 minutos', search: 'Search og lagda', searchPlaceholder: 'I-type ang lagda o keyword...', borrow: 'Hulam og kagamitan', language: 'Pinulongan', textSize: 'Gidak-on sa text', contrast: 'High contrast', close: 'Sirad-i', noResults: 'Walay match nga lagda', noResultsHelp: 'Sulayi og laing keyword.', checkoutTitle: 'Pag-hulam ug pag-uli sa gamit', checkoutIntro: 'Pangutana sa lab assistant una ka manghulam og gamit.', checkoutSteps: ['Ipakita in person imong student ID sa lab assistant. Dili mangayo o mag-store og ID ang app, klaro ta ana, unlike sa imong crush.', 'Sultihi ang assistant unsay gamit imong kinahanglan, unya hulata ang go signal before kuhaon.', 'I-check ang gamit uban sa assistant ug sundon ang sign-out process sa lab.', 'Iuli mismo sa assistant ang gamit human gamiton, unya pa-confirm nga kompleto ug okay pa ang condition.'], checkoutNote: 'Sunda ang posted checkout process sa inyong lab. Ang availability, kadugayon sa hulam, ug uban pang requirements kay lab ang magbuot.', back: 'Balik sa lagda', previous: 'Balik', next: 'Sunod nga lagda', finish: 'Human na', progress: 'Progress sa pagbasa', chooseRule: 'Pilia ang lagda', closeSearch: 'Sirad-i ang search', sizeDown: 'Gamayi ang text', sizeUp: 'Padak-a ang text', contrastToggle: 'I-toggle ang dark mode', complete: 'Human na, walay ghosting!', completeText: 'Nahuman na nimo ang 21 ka lagda. Tabang ta nga safe, respectful, ug ready-to-learn ang laboratoryo.', backCover: 'Balik sa cover', searchLabel: 'Search og lagda' },
}

function App() {
  const [folderOpen, setFolderOpen] = useState(false)
  const [started, setStarted] = useState(false)
  const [currentRule, setCurrentRule] = useState(0)
  const [language, setLanguage] = useState<Language>('en')
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem('comlab-color-theme')
    return isTheme(savedTheme) ? savedTheme : 'green'
  })
  const [textScale, setTextScale] = useState(1)
  const [darkMode, setDarkMode] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [equipmentOpen, setEquipmentOpen] = useState(false)
  const displayedRule = Math.min(currentRule + 1, rules.length)
  const localizedRules = language === 'en' ? rules : translations[language]
  const rule = localizedRules[Math.min(currentRule, rules.length - 1)]
  const text = interfaceText[language]
  const ruleLength = rule.title.length + rule.details.length + (rule.points?.join('').length ?? 0)
  const ruleSize = ruleLength > 370 ? 'long' : ruleLength < 180 && !rule.points ? 'short' : 'standard'
  const decreaseText = () => setTextScale((scale) => Math.max(MIN_TEXT_SCALE, Number((scale - TEXT_SCALE_STEP).toFixed(1))))
  const increaseText = () => setTextScale((scale) => Math.min(MAX_TEXT_SCALE, Number((scale + TEXT_SCALE_STEP).toFixed(1))))
  const matchingRules = localizedRules
    .map((item, index) => ({ ...item, index }))
    .filter((item) => `${item.title} ${item.details} ${item.points?.join(' ') ?? ''}`.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase()))

  useEffect(() => {
    if (!started) return

    const handleArrowKeys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setEquipmentOpen(false)
      }
      if (searchOpen || equipmentOpen) return
      if (event.key === 'ArrowRight') setCurrentRule((index) => Math.min(index + 1, rules.length - 1))
      if (event.key === 'ArrowLeft') setCurrentRule((index) => Math.max(index - 1, 0))
    }

    window.addEventListener('keydown', handleArrowKeys)
    return () => window.removeEventListener('keydown', handleArrowKeys)
  }, [started, searchOpen, equipmentOpen])

  useEffect(() => {
    document.documentElement.lang = language === 'maoy' ? 'ceb' : language
  }, [language])

  useEffect(() => {
    window.localStorage.setItem('comlab-color-theme', theme)
  }, [theme])

  const startReading = () => {
    setCurrentRule(0)
    setStarted(true)
  }

  const restart = () => {
    setCurrentRule(0)
    setStarted(false)
    setFolderOpen(false)
  }

  return (
    <main
      className={`app-screen ${started ? 'reading-screen' : 'cover-screen'} ${darkMode ? 'dark-mode' : ''}`}
      data-theme={theme}
      style={{ '--text-scale': textScale } as CSSProperties}
    >
      {!started ? (
        <>
        <section className="cover-content" aria-label="Computer laboratory rules introduction">
          <div className="cover-tools">
            <label className="language-control">
              <span>{text.language}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={text.language}>
                <option value="en">English</option>
                <option value="ceb">Gen Z Bisaya</option>
                <option value="maoy">Maoy Bisaya (Joke)</option>
              </select>
            </label>
            <div className="accessibility-tools" role="group" aria-label="Text and display settings">
              <button className="text-size-button" type="button" aria-label={text.sizeDown} onClick={decreaseText} disabled={textScale <= MIN_TEXT_SCALE} title={`Text size: ${Math.round(textScale * 100)}%`}>A−</button>
              <button className="text-size-button" type="button" aria-label={text.sizeUp} onClick={increaseText} disabled={textScale >= MAX_TEXT_SCALE} title={`Text size: ${Math.round(textScale * 100)}%`}>A+</button>
              <label className="theme-control">
                <select className="theme-select" aria-label="Color theme" title="Color theme" value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
                  {themes.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select>
              </label>
              <button className={`contrast-button ${darkMode ? 'selected' : ''}`} type="button" aria-label="Toggle dark mode" title="Dark mode" aria-pressed={darkMode} onClick={() => setDarkMode((value) => !value)}>☾</button>
            </div>
          </div>
          <div className="cover-kicker">COMPUTER LABORATORY</div>
          <h1>{text.coverTitle}</h1>
          <p className="cover-subtitle">{text.coverSubtitle}</p>
          <p className="cover-intro">{text.coverIntro}</p>

          <button
            className={`folder-card ${folderOpen ? 'is-open' : ''}`}
            type="button"
            aria-expanded={folderOpen}
            onClick={() => setFolderOpen((open) => !open)}
          >
            <span className="folder-hint">{folderOpen ? text.folderReady : text.folderHint}</span>
            <span className="folder-art" aria-hidden="true">
              <span className="folder-back">
                <span className="folder-tab" />
              </span>
              <span className="folder-paper paper-three"><span>LAB ETIQUETTE</span><i>04—08</i></span>
              <span className="folder-paper paper-two"><span>USING THE LAB</span><i>09—15</i></span>
              <span className="folder-paper paper-one"><span>LAB RULES</span></span>
              <span className="folder-front">
                <span className="folder-brand">{text.coverSubtitle.toUpperCase()}</span>
                <span className="folder-card-title">Lab rules<br />&amp; regulations</span>
                <span className="folder-card-count"><span className="folder-status" /> STUDENT GUIDE</span>
              </span>
            </span>
            <span className="folder-caption">{folderOpen ? text.folderOpen : text.folderCaption}</span>
          </button>

          <div className={`start-area ${folderOpen ? 'visible' : ''}`} aria-hidden={!folderOpen}>
            <p>{text.startPrompt}</p>
            <button className="start-button" type="button" tabIndex={folderOpen ? 0 : -1} onClick={startReading}>
              {text.startReading} <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
        <footer className="cover-footer">Computer Laboratory</footer>
        </>
      ) : (
        <section className="reader" aria-label="Student rules and regulations">
          <div className="reader-main">
            <header className="reader-header">
              <button className="back-to-cover" onClick={() => setStarted(false)} type="button"><span aria-hidden="true">←</span> {text.cover}</button>
              <span className="reader-count">{String(displayedRule).padStart(2, '0')} <i>/</i> {String(rules.length).padStart(2, '0')}</span>
            </header>

            <div className="reader-tools" aria-label="Reader tools">
              <label className="language-control">
                <span>{text.language}</span>
                <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} aria-label={text.language}>
                  <option value="en">English</option>
                  <option value="ceb">Gen Z Bisaya</option>
                  <option value="maoy">Maoy Bisaya (Joke)</option>
                </select>
              </label>
              <div className="accessibility-tools" role="group" aria-label="Text and display settings">
                <button className="text-size-button" type="button" aria-label={text.sizeDown} onClick={decreaseText} disabled={textScale <= MIN_TEXT_SCALE} title={`Text size: ${Math.round(textScale * 100)}%`}>A−</button>
                <button className="text-size-button" type="button" aria-label={text.sizeUp} onClick={increaseText} disabled={textScale >= MAX_TEXT_SCALE} title={`Text size: ${Math.round(textScale * 100)}%`}>A+</button>
                <label className="theme-control">
                  <select className="theme-select" aria-label="Color theme" title="Color theme" value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
                    {themes.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>
                <button className={`contrast-button ${darkMode ? 'selected' : ''}`} type="button" aria-label="Toggle dark mode" title="Dark mode" aria-pressed={darkMode} onClick={() => setDarkMode((value) => !value)}>☾</button>
              </div>
            </div>

            <div className="reader-progress" role="progressbar" aria-label={text.progress} aria-valuemin={1} aria-valuemax={rules.length} aria-valuenow={displayedRule}>
              <span style={{ width: `${(displayedRule / rules.length) * 100}%` }} />
            </div>

            {currentRule < rules.length ? (
              <article className={`rule-slide rule-slide-${ruleSize}`} key={currentRule} aria-live="polite">
                <h1>{rule.title}</h1>
                <p className="slide-details">{rule.details}</p>
                {rule.points && (
                  <ul className="slide-points">
                    {rule.points.map((point) => <li key={point}><span aria-hidden="true">✓</span>{point}</li>)}
                  </ul>
                )}
              </article>
            ) : (
              <article className="completion-card" aria-live="polite">
                <div className="completion-icon">✓</div>
                <h1>{text.complete}</h1>
                <p>{text.completeText}</p>
                <button className="start-button" onClick={restart} type="button">{text.backCover} <span aria-hidden="true">↗</span></button>
              </article>
            )}

            {currentRule < rules.length && (
              <nav className="reader-controls" aria-label="Rule controls">
                <button className="previous-button" onClick={() => setCurrentRule((index) => Math.max(index - 1, 0))} disabled={currentRule === 0} type="button">
                  <span aria-hidden="true">←</span> {text.previous}
                </button>
                <div className="rule-selectors" role="group" aria-label={text.chooseRule}>
                  {localizedRules.map((item, index) => (
                    <button
                      key={item.title}
                      className={`rule-selector selector-color-${index % 7} ${index === currentRule ? 'current' : index < currentRule ? 'read' : ''}`}
                      type="button"
                      aria-label={`Go to rule ${index + 1}: ${item.title}`}
                      aria-current={index === currentRule ? 'step' : undefined}
                      onClick={() => setCurrentRule(index)}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
                <button className="next-button" onClick={() => setCurrentRule((index) => Math.min(index + 1, rules.length))} type="button">
                  {currentRule === rules.length - 1 ? text.finish : text.next} <span aria-hidden="true">→</span>
                </button>
              </nav>
            )}
          </div>
          <button
            className="search-fab"
            type="button"
            aria-label={text.search}
            title={text.search}
            onClick={() => { setEquipmentOpen(false); setSearchOpen(true) }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
          </button>
          <button
            className="equipment-fab"
            type="button"
            aria-label={text.borrow}
            title={text.borrow}
            onClick={() => { setSearchOpen(false); setEquipmentOpen(true) }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="7" width="17" height="13" rx="2" />
              <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3.5 12h17M10 12v2h4v-2" />
            </svg>
          </button>
        </section>
      )}
      {started && searchOpen && (
        <div className="feature-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false) }}>
          <section className="feature-dialog search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title">
            <div className="dialog-heading">
              <h2 id="search-dialog-title">{text.search}</h2>
              <button className="dialog-close" type="button" aria-label={text.closeSearch} onClick={() => setSearchOpen(false)}>×</button>
            </div>
            <input className="rule-search-input" type="search" autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={text.searchPlaceholder} aria-label={text.searchLabel} />
            <div className="search-results" role="listbox" aria-label={text.search}>
              {matchingRules.map((item) => (
                <button className="search-result" key={item.index} type="button" role="option" aria-selected="false" onClick={() => { setCurrentRule(item.index); setSearchOpen(false); setSearchQuery('') }}>
                  <span className={`search-result-number selector-color-${item.index % 7}`}>{String(item.index + 1).padStart(2, '0')}</span>
                  <span><strong>{item.title}</strong><small>{item.details}</small></span>
                  <span className="search-result-arrow" aria-hidden="true">→</span>
                </button>
              ))}
              {matchingRules.length === 0 && <p className="no-search-results">{text.noResults}<small>{text.noResultsHelp}</small></p>}
            </div>
          </section>
        </div>
      )}
      {started && equipmentOpen && (
        <div className="feature-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setEquipmentOpen(false) }}>
          <section className="feature-dialog equipment-dialog" role="dialog" aria-modal="true" aria-labelledby="equipment-dialog-title">
            <div className="dialog-heading">
              <h2 id="equipment-dialog-title">{text.checkoutTitle}</h2>
              <button className="dialog-close" type="button" aria-label={text.close} onClick={() => setEquipmentOpen(false)}>×</button>
            </div>
            <p className="equipment-intro">{text.checkoutIntro}</p>
            <ol className="equipment-steps">
              {text.checkoutSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>)}
            </ol>
            <p className="equipment-note">{text.checkoutNote}</p>
            <button className="start-button equipment-done" type="button" onClick={() => setEquipmentOpen(false)}>{text.close}</button>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
