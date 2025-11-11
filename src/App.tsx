import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import React from 'react'
import './App.css'
import threeSinsCover from './assets/portfolio/games/ThreeSins_cover.png'
import smileRecoveryCover from './assets/portfolio/games/SmileRecovery_cover.png'
import threeSinsContent1 from './assets/portfolio/games/ThreeSins_content1.png'
import threeSinsContent2 from './assets/portfolio/games/ThreeSins_content2.png'
import threeSinsContent3 from './assets/portfolio/games/ThreeSins_content3.jpg'
import smileRecoveryContent1 from './assets/portfolio/games/SmileRecovery_content1.png'
import smileRecoveryContent2 from './assets/portfolio/games/SmileRecovery_content2.png'
import smileRecoveryContent3 from './assets/portfolio/games/SmileRecovery_content3.png'
import smileRecoveryVideo from './assets/portfolio/games/SmileRecovery_video.png'

// Get base URL for assets (handles GitHub Pages subdirectory)
const BASE_URL = import.meta.env.BASE_URL

// Helper function to get public asset path
const getPublicPath = (path: string) => {
  // Remove leading slash if present, then add base URL
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BASE_URL}${cleanPath}`
}

type Page = 'welcome' | 'interests' | 'dreams' | 'favorites' | 'portfolio' | 'skills' | 'experience' | 'games' | 'backend-projects' | 'three-sins' | 'smile-recovery' | 'contact'

interface NavItem {
  id: Page
  label: string
  parent?: string
}

const navItems: NavItem[] = [
  { id: 'welcome', label: 'Welcome', parent: 'Home' },
  { id: 'interests', label: 'Interests', parent: 'Home' },
  { id: 'favorites', label: 'Favorites', parent: 'Home' },
  { id: 'dreams', label: 'Dreams', parent: 'Home' },
  { id: 'games', label: 'Games', parent: 'Portfolio' },
  { id: 'backend-projects', label: 'Backend Projects', parent: 'Portfolio' },
  { id: 'skills', label: 'Skills', parent: 'Skills & Experience' },
  { id: 'experience', label: 'Experience', parent: 'Skills & Experience' },
  { id: 'contact', label: 'Contact', parent: 'Contact' },
]

// Top-level folders (sections that can be expanded)
const topLevelFolders = ['Home', 'Skills & Experience', 'Portfolio', 'Contact']

const codeLanguages = ['C#', 'Java', 'Golang', 'Python']
const humanLanguages = ['English', '简体中文']

// Translation object
const translations: Record<string, Record<string, string>> = {
  'English': {
    'Language': 'Language',
    'Home': 'Home',
    'Welcome': 'Welcome',
    'Interests': 'Interests',
    'Favorites': 'Favorites',
    'Dreams': 'Dreams',
    'Skills & Experience': 'Skills & Experience',
    'Skills': 'Skills',
    'Experience': 'Experience',
    'Portfolio': 'Portfolio',
    'Games': 'Games',
    'Backend Projects': 'Backend Projects',
    'Contact': 'Contact',
    'Three Sins': 'Three Sins',
    'Smile Recovery': 'Smile Recovery',
    'Last Updated': 'Last Updated',
  },
  '简体中文': {
    'Language': '语言',
    'Home': '主页',
    'Welcome': '欢迎',
    'Interests': '兴趣',
    'Favorites': '最爱',
    'Dreams': '理想',
    'Skills & Experience': '技能与经历',
    'Skills': '技能',
    'Experience': '经历',
    'Portfolio': '作品集',
    'Games': '游戏',
    'Backend Projects': '后端项目',
    'Contact': '联系方式',
    'Three Sins': '《三毒》',
    'Smile Recovery': '《笑脸康复工程》',
    'Last Updated': '上次更新',
  },
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome')
  const [openTabs, setOpenTabs] = useState<Page[]>(['welcome']) // Track open tabs
  const [highlightedGame, setHighlightedGame] = useState<string | null>(null) // Track highlighted game
  const [threeSinsImageIndex, setThreeSinsImageIndex] = useState(0) // Track current image index for Three Sins
  const [smileRecoveryImageIndex, setSmileRecoveryImageIndex] = useState(0) // Track current image index for Smile Recovery
  const [hoveredNavButton, setHoveredNavButton] = useState<'left' | 'right' | null>(null) // Track hovered nav button
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [expandedLangCategory, setExpandedLangCategory] = useState<string | null>(null)
  const [selectedCodeLang, setSelectedCodeLang] = useState<string | null>(null)
  const [selectedHumanLang, setSelectedHumanLang] = useState<string | null>('English')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Home']))
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [isResizing, setIsResizing] = useState(false)
  const [draggedTabIndex, setDraggedTabIndex] = useState<number | null>(null)
  const [dragOverTabIndex, setDragOverTabIndex] = useState<number | null>(null)
  const [isDraggingTab, setIsDraggingTab] = useState(false)
  const [isDraggingToEnd, setIsDraggingToEnd] = useState(false)
  const [isDraggingToStart, setIsDraggingToStart] = useState(false)
  const [splitContent, setSplitContent] = useState<string[]>([])
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set()) // Track loaded images
  const langMenuRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)
  const editorContentRef = useRef<HTMLDivElement>(null)

  // Translation helper function
  const t = (key: string): string => {
    const lang = selectedHumanLang || 'English'
    return translations[lang]?.[key] || key
  }

  // Format date based on language
  const formatDate = (): string => {
    const lang = selectedHumanLang || 'English'
    if (lang === '简体中文') {
      return '2025年11月'
    }
    return 'Nov 2025'
  }

  // Preload skill images on component mount
  useEffect(() => {
    const skillImages = [
      getPublicPath('tech-logos/Unity.png'),
      getPublicPath('tech-logos/Jira.png'),
      getPublicPath('tech-logos/Miro.png'),
      getPublicPath('tech-logos/Figma.png'),
      getPublicPath('tech-logos/Lark.png'),
      getPublicPath('tech-logos/SpringBoot.png'),
      getPublicPath('tech-logos/Kitex.png'),
      getPublicPath('tech-logos/MySQL.png'),
      getPublicPath('tech-logos/Redis.png'),
      getPublicPath('tech-logos/MongoDB.png'),
      getPublicPath('tech-logos/RocketMQ.png'),
      getPublicPath('tech-logos/RabbitMQ.png'),
      getPublicPath('tech-logos/Kafka.png'),
      getPublicPath('tech-logos/Git.png')
    ]
    
    const loadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          setLoadedImages(prev => new Set(prev).add(src))
          resolve()
        }
        img.onerror = reject
        img.src = src
      })
    }
    
    // Preload all images
    Promise.all(skillImages.map(loadImage)).catch(() => {
      // Silently handle errors - images will load normally if preload fails
    })
  }, [])

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false)
        setExpandedLangCategory(null)
      }
    }

    if (isLangMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLangMenuOpen])

  // Handle sidebar resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = e.clientX
      const minWidth = 150 // Minimum width to show folder names (increased from 120)
      const maxWidth = window.innerWidth * 0.35 // Maximum 35% of screen width (reduced from 50%)
      
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  // Split long lines for interests, favorites, dreams pages
  useLayoutEffect(() => {
    const shouldSplitLines = ['interests', 'favorites', 'dreams'].includes(currentPage)
    
    if (!shouldSplitLines) {
      setSplitContent([])
      return
    }
    
    const updateSplitContent = () => {
      // Get content based on current page using getPageContent()
      let content: string[] = getPageContent()
      
      // Only split for interests, favorites, and dreams pages
      if (currentPage !== 'interests' && currentPage !== 'favorites' && currentPage !== 'dreams') {
        setSplitContent(content)
        return
      }
      
      // Use ref width if available, otherwise estimate based on window width and sidebar
      let containerWidth: number
      if (editorContentRef.current && editorContentRef.current.offsetWidth > 0) {
        containerWidth = editorContentRef.current.offsetWidth
      } else {
        // Estimate: window width - sidebar width - some padding
        containerWidth = Math.max(window.innerWidth - sidebarWidth - 100, 600)
      }
      
      const allLines: string[] = []
      
      content.forEach((line) => {
        if (line === '') {
          allLines.push('')
        } else {
          const splitLines = splitLongLine(line, containerWidth)
          splitLines.forEach((splitLine) => {
            allLines.push(splitLine)
          })
        }
      })
      
      setSplitContent(allLines)
    }
    
    // Immediately calculate with estimated width to avoid initial flash
    updateSplitContent()
    
    // Then refine with actual ref width on next frame if available
    const rafId = requestAnimationFrame(() => {
      if (editorContentRef.current && editorContentRef.current.offsetWidth > 0) {
        updateSplitContent()
      }
    })
    
    // Update on window resize
    const handleResize = () => {
      requestAnimationFrame(updateSplitContent)
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [currentPage, sidebarWidth, selectedHumanLang])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  // Helper function to switch page and close backend-projects if switching away from it
  const switchPage = (newPageId: Page) => {
    // If switching away from backend-projects, close it
    if (currentPage === 'backend-projects' && newPageId !== 'backend-projects') {
      const newTabs = openTabs.filter(tab => tab !== 'backend-projects')
      setOpenTabs(newTabs)
    }
    setCurrentPage(newPageId)
  }

  // Handle opening a page (add to tabs if not already open)
  const handlePageClick = (pageId: Page) => {
    // First, handle closing backend-projects if switching away from it
    let updatedTabs = [...openTabs]
    if (currentPage === 'backend-projects' && pageId !== 'backend-projects') {
      updatedTabs = updatedTabs.filter(tab => tab !== 'backend-projects')
    }
    
    // Add to open tabs if not already present
    if (!updatedTabs.includes(pageId)) {
      updatedTabs = [...updatedTabs, pageId]
    }
    
    // Update tabs and page
    setOpenTabs(updatedTabs)
    setCurrentPage(pageId)
    
    // Reset image index when opening Three Sins page
    if (pageId === 'three-sins') {
      setThreeSinsImageIndex(0)
    }
    // Reset image index when opening Smile Recovery page
    if (pageId === 'smile-recovery') {
      setSmileRecoveryImageIndex(0)
    }
  }

  // Handle closing a tab
  const handleCloseTab = (pageId: Page, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering tab click
    
    const newTabs = openTabs.filter(tab => tab !== pageId)
    setOpenTabs(newTabs)
    
    // If closing the current tab, switch to another tab
    if (currentPage === pageId) {
      if (newTabs.length > 0) {
        // Switch to the last tab, or the tab before the closed one
        const closedIndex = openTabs.indexOf(pageId)
        const newIndex = closedIndex > 0 ? closedIndex - 1 : 0
        switchPage(newTabs[newIndex])
      } else {
        // If no tabs left, set to welcome (shouldn't happen as welcome is always open)
        switchPage('welcome')
        setOpenTabs(['welcome'])
      }
    }
  }

  // Handle drag and drop for tabs
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedTabIndex(index)
    setIsDraggingTab(true)
    // Switch to the dragged tab's page
    switchPage(openTabs[index])
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', '')
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    // Only update if the target index actually changed to prevent flickering
    if (draggedTabIndex !== null && draggedTabIndex !== index) {
      // Use a small delay to debounce rapid changes
      if (dragOverTabIndex !== index) {
        setDragOverTabIndex(index)
        // If dragging over the last tab, check if we're after it or on it
        const isLastTab = index === openTabs.length - 1
        const isFirstTab = index === 0
        if (isLastTab) {
          // Check mouse position relative to the tab
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
          const x = e.clientX
          setIsDraggingToEnd(x > rect.right - 20)
          setIsDraggingToStart(false)
        } else if (isFirstTab) {
          // Check mouse position relative to the first tab
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
          const x = e.clientX
          setIsDraggingToStart(x < rect.left + 20)
          setIsDraggingToEnd(false)
        } else {
          setIsDraggingToEnd(false)
          setIsDraggingToStart(false)
        }
      }
    }
  }

  const handleDragLeave = () => {
    // Don't clear dragOverTabIndex here to prevent flickering
    // It will be updated by handleDragOver when moving to a new tab
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedTabIndex === null) return

    const newTabs = [...openTabs]
    
    // Use dragOverTabIndex if available, otherwise use dropIndex
    const targetIndex = dragOverTabIndex !== null ? dragOverTabIndex : dropIndex
    
    // Check if this is an adjacent swap
    const isAdjacentSwap = Math.abs(draggedTabIndex - targetIndex) === 1
    
    if (isAdjacentSwap) {
      // For adjacent swap, directly swap the two tabs
      const temp = newTabs[draggedTabIndex]
      newTabs[draggedTabIndex] = newTabs[targetIndex]
      newTabs[targetIndex] = temp
    } else if (draggedTabIndex !== targetIndex) {
      // For non-adjacent, use insertion logic
      const draggedTab = newTabs[draggedTabIndex]
      
      // Remove dragged tab from its original position
      newTabs.splice(draggedTabIndex, 1)
      
      // Calculate the correct insertion index
      const isLastTab = targetIndex === openTabs.length - 1
      const isFirstTab = targetIndex === 0
      let insertIndex: number
      if (isLastTab && isDraggingToEnd) {
        // Dragging to the end: insert at the end (after removing dragged tab)
        insertIndex = newTabs.length
      } else if (isFirstTab && isDraggingToStart) {
        // Dragging to the start: insert at the beginning
        insertIndex = 0
      } else if (draggedTabIndex < targetIndex) {
        // Dragging forward: insert at targetIndex - 1 (because we removed one element before targetIndex)
        insertIndex = targetIndex - 1
      } else {
        // Dragging backward: insert after targetIndex (targetIndex + 1)
        // If targetIndex is the last tab but not dragging to end, insert before last (become second to last)
        if (isLastTab && !isDraggingToEnd) {
          insertIndex = targetIndex
        } else {
          insertIndex = targetIndex + 1
        }
      }
      
      // Ensure insertIndex doesn't exceed array bounds
      insertIndex = Math.min(insertIndex, newTabs.length)
      insertIndex = Math.max(0, insertIndex)
      
      // Insert at new position
      newTabs.splice(insertIndex, 0, draggedTab)
    }
    
    setOpenTabs(newTabs)
    setDraggedTabIndex(null)
    setDragOverTabIndex(null)
    setIsDraggingTab(false)
    setIsDraggingToEnd(false)
    setIsDraggingToStart(false)
  }

  const handleDragEnd = () => {
    setDraggedTabIndex(null)
    setDragOverTabIndex(null)
    setIsDraggingTab(false)
    setIsDraggingToEnd(false)
    setIsDraggingToStart(false)
  }

  const handleTabClick = (tabId: Page) => {
    // Only switch page if not dragging
    if (!isDraggingTab) {
      switchPage(tabId)
    }
  }

  // Helper function to split long lines into multiple lines based on container width
  const splitLongLine = (text: string, containerWidth: number, fontSize: number = 16, fontFamily: string = '"Fira Code", "JetBrains Mono", "Consolas", monospace'): string[] => {
    if (!text || text.trim() === '') return [text]
    
    // Create a temporary element to measure text width
    const measureEl = document.createElement('span')
    measureEl.style.position = 'absolute'
    measureEl.style.visibility = 'hidden'
    measureEl.style.whiteSpace = 'nowrap'
    measureEl.style.fontSize = `${fontSize}px`
    measureEl.style.fontFamily = fontFamily
    document.body.appendChild(measureEl)
    
    const lines: string[] = []
    const words = text.split(/(\s+)/) // Split by spaces but keep spaces
    let currentLine = ''
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const testLine = currentLine + word
      measureEl.textContent = testLine
      const width = measureEl.offsetWidth
      
      // Account for padding (16px left + 16px right) and line number width (48px + 8px padding)
      const availableWidth = containerWidth - 16 - 16 - 48 - 8 - 90 // padding + line number + right padding
      
      if (width > availableWidth && currentLine !== '') {
        lines.push(currentLine.trimEnd())
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine.trim() !== '') {
      lines.push(currentLine.trimEnd())
    }
    
    document.body.removeChild(measureEl)
    return lines.length > 0 ? lines : [text]
  }

  const getPageContent = (): string[] => {
    if (currentPage === 'welcome') {
      const lang = selectedHumanLang || 'English'
      if (lang === '简体中文') {
      return [
          "Hello World —— 欢迎来到 Yve 的个人网站！",
          "她白天是软件工程师，晚上是独立开发者。",
          "",
          "你是 机器 🤖 还是 人类 👤？",
          "请从顶部栏选择你偏好的 语言 开始探索网站。 // 部分语言功能调试中",
          "",
          "有任何疑问？",
          "你可以通过邮箱联系她，或从左侧面板打开 联系方式 了解更多。",
        ]
      }
      return [
        "Hello World — welcome to Yve's personal website!",
        "She is a software engineer by day and an indie builder by night.",
        "",
        "Are you a machine 🤖 or a human 👤?",
        "Please select your preferred Language from the top bar to begin exploring. // some language features under construction",
        "",
        "Have questions?",
        "Reach out via Email, or open Contact from the left panel for more info.",
      ]
    }
    if (currentPage === 'interests') {
      const lang = selectedHumanLang || 'English'
      if (lang === '简体中文') {
        return [
          "虚拟/增强现实：",
          "她在这个领域的偶像是黄心健，希望能像他一样创作出震撼人心的艺术作品。",
          "",
          "游戏开发：",
          "她平时会用 Unity 尝试开发各种小项目 —— 随时欢迎合作或 Game Jam 组队！",
          "",
          "人工智能：",
          "她尤其关注 AI 在上述领域的开发过程中的应用，希望能提升开发者效率、降低创作门槛。",
        ]
      }
      return [
        "VR/AR: Her idol in this field is Hsin-Chien Huang, and she hopes to create artworks as emotionally powerful as his.",
        "",
        "Game Dev: She experiments with various small projects in Unity — and is always open to Game Jam collaborations!",
        "",
        "AI: She's especially interested in how AI can be applied to creative and product development in these fields, to improve developer efficiency and lower the barrier to creation.",
      ]
    }
    if (currentPage === 'favorites') {
      const lang = selectedHumanLang || 'English'
      if (lang === '简体中文') {
        return [
          "最喜欢的游戏： 她喜欢《底特律：变人》那样以剧情核心、由玩家选择驱动的互动电影式游戏，也喜欢《锈湖》那样画风复古怪诞、风格鲜明的解密游戏；她不太喜欢MOBA、魂系等重操作的硬核游戏，因为她技术很菜。",
          "",
          "最喜欢的城市：  巴黎。因为她在那里度过了最无忧无虑的18岁，也是在那里她第一次真正理解\"生活不是竞技场\"，并下定决心转学重读她一直害怕的计算机科学专业（起初不敢学，是因为她中学理科考试从未赢过班里的竞赛生）。",
        ]
      }
      return [
        "Favorite Game: She loves puzzle games like Rusty Lake for their retro, eerie and distinctive style, and story-driven interactive titles like Detroit: Become Human, where player choices shape the plot. She's not into hardcore games like MOBAs or Souls-likes — she's just bad at them.",
        "",
        "Favorite City: Paris. She spent her most carefree 18 there, and it was also where she first realized that life isn't a competition. Feeling inspired, she decided to transfer and restart in the field she once feared the most — Computer Science — a subject she'd avoided since middle school because she had never beaten the class's science competition kids.",
      ]
    }
    if (currentPage === 'dreams') {
      const lang = selectedHumanLang || 'English'
      if (lang === '简体中文') {
        return [
          "她希望成为一名值得信赖的工程师，",
          "能与富有创意的艺术家们一起创造更多美好的作品。",
          "",
          "她想成为一个对社会有价值的人，",
          "她期待自己的作品能打动哪怕一小部分人，而非所有人。",
          "",
          "她并不是一个特别有野心的人 ——",
          "她不想改变世界，只想尽最大努力找到一个最适合她的位置。",
        ]
      }
      return [
        "She hopes to become a trustworthy engineer, creating beautiful things together with imaginative and artistic minds.",
        "",
        "She wants to be someone of value to society, and hopes her work can touch a small group of people rather than everyone.",
        "",
        "She isn't a particularly ambitious person — she doesn't want to change the world, but hopes to find the place in it that fits her best.",
      ]
    }
    if (currentPage === 'skills') {
      const lang = selectedHumanLang || 'English'
      if (lang === '简体中文') {
        return [
          "游戏开发：",
          "",
          "[UNITY_LOGO]",
          "",
          "[PM_LOGOS]",
          "",
          "",
          "后端开发：",
          "",
          "[FRAMEWORK_LOGOS]",
          "",
          "[DATABASE_LOGOS]",
          "",
          "[MQ_LOGOS]",
          "",
          "[GIT_LOGO]",
          "",
        ]
      }
      return [
        "Game Dev:",
        "",
        "[UNITY_LOGO]",
        "",
        "[PM_LOGOS]",
        "",
        "",
        "Backend Dev:",
        "",
        "[FRAMEWORK_LOGOS]",
        "",
        "[DATABASE_LOGOS]",
        "",
        "[MQ_LOGOS]",
        "",
        "[GIT_LOGO]",
        "",
      ]
    }
    if (currentPage === 'games') {
      return [
        "[GAMES_PROJECTS]",
      ]
    }
    if (currentPage === 'three-sins') {
      return [
        "[THREE_SINS_CONTENT]",
      ]
    }
    if (currentPage === 'smile-recovery') {
      return [
        "[SMILE_RECOVERY_CONTENT]",
      ]
    }
    if (currentPage === 'backend-projects') {
      const lang = selectedHumanLang || 'English'
      if (lang === '简体中文') {
        return ["// 快了 —— 她最近在debug现实"]
      }
      return ["// Coming soon — she's debugging reality (recently)"]
    }
    if (currentPage === 'experience') {
      const lang = selectedHumanLang || 'English'
      if (lang === '简体中文') {
        return [
          "教育背景：",
          "哥伦比亚大学   —  本科 计算机科学  // 在读",
          "欧洲高等商学院 —  本科 管理学     // 转学",
          "",
          "职业经历：",
          "字节跳动  —  后端开发 实习        // 2025年 5-8月",
          "育碧     —  项目管理 实习        // 2024年 5-8月"
        ]
      }
      return [
        "Education:",
        "Columbia University  —  B.A. in Computer Science  // Current Student",
        "ESCP Business School —  B.S. in Management        // Transferred",
        "",
        "Professional:",
        "ByteDance  —  SWE Intern        // May–Aug 2025",
        "Ubisoft    —  PM Intern         // May–Aug 2024"
      ]
    }
    if (currentPage === 'contact') {
      return [
        "[CONTACT_EMAIL]",
        "",
        "",
        "[CONTACT_DISCORD]",
        "",
        "",
        "[CONTACT_LINKEDIN]",
        "",
        "",
        "[CONTACT_INSTAGRAM]",
        ""
      ]
    }
    return ["// In progress — she's debugging reality (recently)"]
  }

  const renderLine = (line: string, lineNum: number) => {
    if (currentPage === 'welcome' && line) {
      // Syntax highlighting for welcome page (similar to interests, favorites, dreams)
      const parts: Array<{ text: string; className: string }> = []
      let text = line
      let lastIndex = 0
      
      // Find all matches for different syntax elements
      const matches: Array<{ index: number; length: number; className: string }> = []
      
      // Find comments (// ...) - java comment (gray) - match first to ensure comments are gray
      const commentRegex = /\/\/.*$/g
      let commentMatch
      while ((commentMatch = commentRegex.exec(text)) !== null) {
        matches.push({ index: commentMatch.index, length: commentMatch[0].length, className: 'java-comment' })
      }
      
      // Helper function to check if a position is within a comment
      const isInComment = (index: number, length: number) => {
        return matches.some(m => 
          m.className === 'java-comment' &&
          index >= m.index && 
          index + length <= m.index + m.length
        )
      }
      
      // Find "Hello World" - section title (yellow, bold)
      const helloWorldRegex = /\bHello World\b/gi
      let helloWorldMatch: RegExpExecArray | null
      while ((helloWorldMatch = helloWorldRegex.exec(text)) !== null) {
        if (!isInComment(helloWorldMatch.index, helloWorldMatch[0].length)) {
          matches.push({ index: helloWorldMatch.index, length: helloWorldMatch[0].length, className: 'section-title' })
        }
      }
      
      // Find proper nouns (Yve) - proper noun
      const properNounRegex = /\bYve\b/g
      let properNounMatch: RegExpExecArray | null
      while ((properNounMatch = properNounRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          properNounMatch!.index >= m.index && properNounMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(properNounMatch.index, properNounMatch[0].length)) {
          matches.push({ index: properNounMatch.index, length: properNounMatch[0].length, className: 'proper-noun' })
        }
      }
      
      // Find technical terms - handle multi-word phrases first, then single words
      const technicalPhrases = [
        'software engineer',
        'indie builder',
        '软件工程师',
        '独立开发者'
      ]
      
      // Sort phrases by length (longest first) to prioritize longer matches
      technicalPhrases.sort((a, b) => b.length - a.length)
      
      technicalPhrases.forEach(phrase => {
        const phraseRegex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        let phraseMatch: RegExpExecArray | null
        while ((phraseMatch = phraseRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            phraseMatch!.index >= m.index && phraseMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched && !isInComment(phraseMatch.index, phraseMatch[0].length)) {
            matches.push({ 
              index: phraseMatch.index, 
              length: phraseMatch[0].length, 
              className: 'technical-term'
            })
          }
        }
      })
      
      // Find single-word technical terms (machine, human, 机器, 人类) - but not email (handled separately)
      const singleWordTechRegex = /\b(machine|human)\b|机器|人类/gi
      let singleWordTechMatch: RegExpExecArray | null
      while ((singleWordTechMatch = singleWordTechRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          singleWordTechMatch!.index >= m.index && singleWordTechMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(singleWordTechMatch.index, singleWordTechMatch[0].length)) {
          matches.push({ 
            index: singleWordTechMatch.index, 
            length: singleWordTechMatch[0].length, 
            className: 'technical-term'
          })
        }
      }
      
      // Find "email" word - make it a link (but "邮箱" should be blue technical term)
      const emailRegex = /\bemail\b/gi
      let emailMatch: RegExpExecArray | null
      while ((emailMatch = emailRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          emailMatch!.index >= m.index && emailMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(emailMatch.index, emailMatch[0].length)) {
          matches.push({ 
            index: emailMatch.index, 
            length: emailMatch[0].length, 
            className: 'email-link'
          })
        }
      }
      
      // Find "邮箱" - make it a link like "email" (with tooltip)
      const emailChineseRegex = /邮箱/g
      let emailChineseMatch: RegExpExecArray | null
      while ((emailChineseMatch = emailChineseRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          emailChineseMatch!.index >= m.index && emailChineseMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(emailChineseMatch.index, emailChineseMatch[0].length)) {
          matches.push({ 
            index: emailChineseMatch.index, 
            length: emailChineseMatch[0].length, 
            className: 'email-link'
          })
        }
      }
      
      // Find connector words (or, to, via, 来到, 还是, 还, 选择, 可以, 或) - connector words (purple)
      // Match Chinese connectors first (longer phrases before shorter ones)
      const chineseConnectors = ['还是', '来到', '选择', '可以', '还', '或']
      chineseConnectors.forEach(connector => {
        const connectorRegex = new RegExp(connector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        let connectorMatch: RegExpExecArray | null
        while ((connectorMatch = connectorRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            connectorMatch!.index >= m.index && connectorMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched && !isInComment(connectorMatch.index, connectorMatch[0].length)) {
            matches.push({ index: connectorMatch.index, length: connectorMatch[0].length, className: 'connector-word' })
          }
        }
      })
      
      // Find English connector words (or, to, via)
      const englishConnectorRegex = /\b(or|to|via)\b/gi
      let englishConnectorMatch: RegExpExecArray | null
      while ((englishConnectorMatch = englishConnectorRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          englishConnectorMatch!.index >= m.index && englishConnectorMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(englishConnectorMatch.index, englishConnectorMatch[0].length)) {
          matches.push({ index: englishConnectorMatch.index, length: englishConnectorMatch[0].length, className: 'connector-word' })
        }
      }
      
      // Find "Contact" word or "联系方式" - style it like language highlight (without arrow)
      // Match before technical terms to avoid conflicts
      const contactRegex = /\bContact\b|联系方式/gi
      let contactMatch: RegExpExecArray | null
      // Reset regex lastIndex
      contactRegex.lastIndex = 0
      while ((contactMatch = contactRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          contactMatch!.index >= m.index && contactMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(contactMatch.index, contactMatch[0].length)) {
          matches.push({ index: contactMatch.index, length: contactMatch[0].length, className: 'contact-highlight' })
        }
      }
      
      // Find "language" word or "语言" - style it like the top bar button
      const languageRegex = /\blanguage\b|语言/gi
      let languageMatch: RegExpExecArray | null
      while ((languageMatch = languageRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          languageMatch!.index >= m.index && languageMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(languageMatch.index, languageMatch[0].length)) {
          matches.push({ index: languageMatch.index, length: languageMatch[0].length, className: 'language-highlight' })
        }
      }
      
      // Sort matches by index
      matches.sort((a, b) => a.index - b.index)
      
      // Build parts array
      matches.forEach(match => {
        if (match.index > lastIndex) {
          parts.push({ text: text.substring(lastIndex, match.index), className: '' })
        }
        parts.push({ text: text.substring(match.index, match.index + match.length), className: match.className })
        lastIndex = match.index + match.length
      })
      
      if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex), className: '' })
      }
      
      if (parts.length === 0) {
        parts.push({ text: line, className: '' })
      }

      return (
        <div key={lineNum} className="editor-line">
          <span className="line-number">{lineNum}</span>
          <span className="line-content">
            {parts.map((part, idx) => {
              // If this part is language-highlight, add arrow after it
              if (part.className === 'language-highlight') {
                return (
                  <span key={idx}>
                    <span className={part.className}>
                      {part.text}
                      <span className="dropdown-arrow">▶</span>
                    </span>
                  </span>
                )
              }
              // If this part is contact-highlight, add folder icon before it
              if (part.className === 'contact-highlight') {
                return (
                  <span key={idx}>
                    <span className={part.className}>
                      <span className="folder-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="2.5" y="4.5" width="11" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="2.5" y="3" width="5" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="7.5" y1="3" x2="7.5" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </span>
                      {part.text}
                    </span>
                  </span>
                )
              }
              // If this part is email-link, make it a clickable link
              if (part.className === 'email-link') {
                const lang = selectedHumanLang || 'English'
                const tooltipText = lang === '简体中文' ? '发送邮件' : 'send an email'
                return (
                  <span key={idx} className="link-wrapper">
                    <a 
                      href="mailto:yvehu02@gmail.com"
                      className={part.className}
                    >
                      {part.text}
                    </a>
                    <a
                      href="mailto:yvehu02@gmail.com"
                      className="link-tooltip"
                    >
                      {tooltipText}
                    </a>
                  </span>
                )
              }
              return (
              <span key={idx} className={part.className}>
                {part.text}
              </span>
              )
            })}
          </span>
        </div>
      )
    }
    
    if (currentPage === 'interests' && line) {
      // Syntax highlighting for interests page
      const parts: Array<{ text: string; className: string; isLink?: boolean }> = []
      let text = line
      let lastIndex = 0
      
      // Find all matches for different syntax elements
      const matches: Array<{ index: number; length: number; className: string; isLink?: boolean }> = []
      
      // Find category labels (VR/AR:, Game Dev:, AI:, 虚拟/增强现实：, 游戏开发：, 人工智能：) - section titles
      const categoryRegex = /(VR\/AR:|Game Dev:|AI:|虚拟\/增强现实：|游戏开发：|人工智能：)/g
      let categoryMatch
      while ((categoryMatch = categoryRegex.exec(text)) !== null) {
        matches.push({ index: categoryMatch.index, length: categoryMatch[0].length, className: 'section-title' })
      }
      
      // Find proper nouns (Hsin-Chien Huang, 黄心健) - proper noun
      const properNounRegex = /\b(Hsin-Chien Huang)\b|黄心健/g
      let properNounMatch: RegExpExecArray | null
      while ((properNounMatch = properNounRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          properNounMatch!.index >= m.index && properNounMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ 
            index: properNounMatch.index, 
            length: properNounMatch[0].length, 
            className: 'proper-noun',
            isLink: true
          })
        }
      }
      
      // Find technical terms (Unity, Game Jam) - technical terms
      const technicalTermRegex = /\b(Unity|Game Jam)\b/g
      let technicalTermMatch: RegExpExecArray | null
      while ((technicalTermMatch = technicalTermRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          technicalTermMatch!.index >= m.index && technicalTermMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ 
            index: technicalTermMatch.index, 
            length: technicalTermMatch[0].length, 
            className: 'technical-term',
            isLink: false
          })
        }
      }
      
      // Find AI (but not "AI:" at the start) - technical term
      const aiRegex = /\bAI\b/g
      let aiMatch: RegExpExecArray | null
      while ((aiMatch = aiRegex.exec(text)) !== null) {
        // Skip if it's "AI:" at the start (already matched by categoryRegex)
        if (aiMatch.index === 0 && text[aiMatch.index + 2] === ':') {
          continue
        }
        const isAlreadyMatched = matches.some(m => 
          aiMatch!.index >= m.index && aiMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ 
            index: aiMatch.index, 
            length: aiMatch[0].length, 
            className: 'technical-term',
            isLink: false
          })
        }
      }
      
      // Find connector words (in, as, with, to, 这个, 像, 一样, 用, 或, 尤其, 应用) - connector words
      // Match Chinese connectors first (longer phrases before shorter ones)
      // Note: "用" inside "应用" should not be matched separately
      const chineseConnectors = ['应用', '在', '或', '尤其']
      chineseConnectors.forEach(connector => {
        const connectorRegex = new RegExp(connector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      let connectorMatch: RegExpExecArray | null
      while ((connectorMatch = connectorRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          connectorMatch!.index >= m.index && connectorMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: connectorMatch.index, length: connectorMatch[0].length, className: 'connector-word', isLink: false })
          }
        }
      })
      
      // Find "能" separately - but not when it's part of "希望能"
      const nengRegex = /能/g
      let nengMatch: RegExpExecArray | null
      while ((nengMatch = nengRegex.exec(text)) !== null) {
        // Skip if it's part of "希望能"
        if (nengMatch.index >= 2 && text.substring(nengMatch.index - 2, nengMatch.index) === '希望') {
          continue
        }
        const isAlreadyMatched = matches.some(m => 
          nengMatch!.index >= m.index && nengMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: nengMatch.index, length: nengMatch[0].length, className: 'connector-word', isLink: false })
        }
      }
      
      // Find "像" separately - but not when it's part of "偶像"
      const xiangRegex = /像/g
      let xiangMatch: RegExpExecArray | null
      while ((xiangMatch = xiangRegex.exec(text)) !== null) {
        // Skip if it's part of "偶像"
        if (xiangMatch.index > 0 && text[xiangMatch.index - 1] === '偶') {
          continue
        }
        const isAlreadyMatched = matches.some(m => 
          xiangMatch!.index >= m.index && xiangMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: xiangMatch.index, length: xiangMatch[0].length, className: 'connector-word', isLink: false })
        }
      }
      
      // Find "用" separately - but not when it's part of "应用"
      const yongRegex = /用/g
      let yongMatch: RegExpExecArray | null
      while ((yongMatch = yongRegex.exec(text)) !== null) {
        // Skip if it's part of "应用"
        if (yongMatch.index > 0 && text[yongMatch.index - 1] === '应') {
          continue
        }
        const isAlreadyMatched = matches.some(m => 
          yongMatch!.index >= m.index && yongMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: yongMatch.index, length: yongMatch[0].length, className: 'connector-word', isLink: false })
        }
      }
      
      // Find English connector words (in, as, with, to)
      const englishConnectorRegex = /\b(in|as|with|to)\b/gi
      let englishConnectorMatch: RegExpExecArray | null
      while ((englishConnectorMatch = englishConnectorRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          englishConnectorMatch!.index >= m.index && englishConnectorMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: englishConnectorMatch.index, length: englishConnectorMatch[0].length, className: 'connector-word', isLink: false })
        }
      }
      
      // Sort matches by index
      matches.sort((a, b) => a.index - b.index)
      
      // Build parts array
      matches.forEach(match => {
        if (match.index > lastIndex) {
          parts.push({ text: text.substring(lastIndex, match.index), className: '', isLink: false })
        }
        parts.push({ 
          text: text.substring(match.index, match.index + match.length), 
          className: match.className,
          isLink: match.isLink || false
        })
        lastIndex = match.index + match.length
      })
      
      if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex), className: '', isLink: false })
      }
      
      if (parts.length === 0) {
        parts.push({ text: line, className: '', isLink: false })
      }

  return (
        <div key={lineNum} className="editor-line">
          <span className="line-number">{lineNum}</span>
          <span className="line-content">
            {parts.map((part, idx) => 
              part.isLink ? (
                <span key={idx} className="link-wrapper">
                  <a
                    href="https://en.wikipedia.org/wiki/Hsin-Chien_Huang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={part.className}
                  >
                    {part.text}
                  </a>
                  <a
                    href="https://en.wikipedia.org/wiki/Hsin-Chien_Huang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-tooltip"
                  >
                    {selectedHumanLang === '简体中文' ? '维基百科/黄心健' : 'wikipedia/Hsin-Chien Huang'}
                  </a>
                </span>
              ) : (
                <span key={idx} className={part.className}>
                  {part.text}
                </span>
              )
            )}
          </span>
        </div>
      )
    }
    
    if (currentPage === 'favorites' && line) {
      // Syntax highlighting for favorites page
      const parts: Array<{ text: string; className: string }> = []
      let text = line
      let lastIndex = 0
      
      // Find all matches for different syntax elements
      const matches: Array<{ index: number; length: number; className: string }> = []
      
      // Find labels (Favorite Game:, Favorite City:, 最喜欢的游戏：, 最喜欢的城市：) - section titles
      const labelRegex = /(Favorite Game:|Favorite City:|最喜欢的游戏：|最喜欢的城市：)/g
      let labelMatch
      while ((labelMatch = labelRegex.exec(text)) !== null) {
        matches.push({ index: labelMatch.index, length: labelMatch[0].length, className: 'section-title' })
      }
      
      // Find proper nouns (Paris, 巴黎) - proper noun
      const properNounRegex = /\b(Paris)\b|巴黎/g
      let properNounMatch: RegExpExecArray | null
      while ((properNounMatch = properNounRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          properNounMatch!.index >= m.index && properNounMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: properNounMatch.index, length: properNounMatch[0].length, className: 'proper-noun' })
        }
      }
      
      // Find game names (Rusty Lake, Detroit: Become Human, 《底特律：变人》, 《锈湖》) - game names (italic)
      const gameNameRegex = /(Rusty Lake|Detroit: Become Human|《底特律：变人》|《锈湖》)/g
      let gameNameMatch: RegExpExecArray | null
      while ((gameNameMatch = gameNameRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          gameNameMatch!.index >= m.index && gameNameMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: gameNameMatch.index, length: gameNameMatch[0].length, className: 'favorites-game-name' })
        }
      }
      
      // Find other technical terms (MOBAs, Souls-likes, Computer Science, MOBA, 魂系, 计算机科学) - technical terms (no italic)
      const technicalTermRegex = /(MOBAs|Souls-likes|Computer Science|MOBA|魂系|计算机科学)/g
      let technicalTermMatch: RegExpExecArray | null
      while ((technicalTermMatch = technicalTermRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          technicalTermMatch!.index >= m.index && technicalTermMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: technicalTermMatch.index, length: technicalTermMatch[0].length, className: 'technical-term' })
        }
      }
      
      // Find connector words (for, where, 那样, 那里) - connector words
      // Match Chinese connectors first
      const chineseConnectors = ['那样', '那里']
      chineseConnectors.forEach(connector => {
        const connectorRegex = new RegExp(connector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        let connectorMatch: RegExpExecArray | null
        while ((connectorMatch = connectorRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            connectorMatch!.index >= m.index && connectorMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched) {
            matches.push({ index: connectorMatch.index, length: connectorMatch[0].length, className: 'connector-word' })
          }
        }
      })
      
      // Find English connector words (for, where)
      const connectorRegex = /\b(for|where)\b/gi
      let connectorMatch: RegExpExecArray | null
      while ((connectorMatch = connectorRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          connectorMatch!.index >= m.index && connectorMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: connectorMatch.index, length: connectorMatch[0].length, className: 'connector-word' })
        }
      }
      
      // Find numbers (18) - numbers
      const numberRegex = /\b18\b/g
      let numberMatch: RegExpExecArray | null
      while ((numberMatch = numberRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          numberMatch!.index >= m.index && numberMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: numberMatch.index, length: numberMatch[0].length, className: 'number' })
        }
      }
      
      // Sort matches by index
      matches.sort((a, b) => a.index - b.index)
      
      // Build parts array
      matches.forEach(match => {
        if (match.index > lastIndex) {
          parts.push({ text: text.substring(lastIndex, match.index), className: '' })
        }
        parts.push({ text: text.substring(match.index, match.index + match.length), className: match.className })
        lastIndex = match.index + match.length
      })
      
      if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex), className: '' })
      }
      
      if (parts.length === 0) {
        parts.push({ text: line, className: '' })
      }
      
      return (
        <div key={lineNum} className="editor-line">
          <span className="line-number">{lineNum}</span>
          <span className="line-content">
            {parts.map((part, idx) => (
              <span key={idx} className={part.className}>
                {part.text}
              </span>
            ))}
          </span>
        </div>
      )
    }
    
    if (currentPage === 'dreams' && line) {
      // Syntax highlighting for dreams page
      const parts: Array<{ text: string; className: string }> = []
      let text = line
      let lastIndex = 0
      
      // Find all matches for different syntax elements
      const matches: Array<{ index: number; length: number; className: string }> = []
      
      // Find keywords (wants, hope, hopes, 希望, 想, 期待) - connector words
      // Match Chinese connectors first
      const chineseConnectors = ['希望', '期待']
      chineseConnectors.forEach(connector => {
        const connectorRegex = new RegExp(connector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        let connectorMatch: RegExpExecArray | null
        while ((connectorMatch = connectorRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            connectorMatch!.index >= m.index && connectorMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched) {
            matches.push({ index: connectorMatch.index, length: connectorMatch[0].length, className: 'connector-word' })
          }
        }
      })
      
      // Find "想" separately - but not when it's part of "不想"
      const xiangRegex = /想/g
      let xiangMatch: RegExpExecArray | null
      while ((xiangMatch = xiangRegex.exec(text)) !== null) {
        // Skip if it's part of "不想"
        if (xiangMatch.index > 0 && text[xiangMatch.index - 1] === '不') {
          continue
        }
        const isAlreadyMatched = matches.some(m => 
          xiangMatch!.index >= m.index && xiangMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
          matches.push({ index: xiangMatch.index, length: xiangMatch[0].length, className: 'connector-word' })
        }
      }
      
      // Find English keywords (wants, hope, hopes)
      const keywordRegex = /\b(wants|hope|hopes)\b/gi
      let keywordMatch: RegExpExecArray | null
      while ((keywordMatch = keywordRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          keywordMatch!.index >= m.index && keywordMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched) {
        matches.push({ index: keywordMatch.index, length: keywordMatch[0].length, className: 'connector-word' })
        }
      }
      
      // Find highlight phrases - longer phrases first to handle overlaps
      const highlightPhrases = [
        'change the world',
        'fits her best',
        'value to society',
        'small group of people',
        'trustworthy engineer',
        'beautiful things',
        'imaginative and artistic minds',
        '最适合她的',
        '一小部分人',
        '工程师'
      ]
      
      // Sort phrases by length (longest first) to prioritize longer matches
      highlightPhrases.sort((a, b) => b.length - a.length)
      
      highlightPhrases.forEach(phrase => {
        const phraseRegex = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        let phraseMatch: RegExpExecArray | null
        while ((phraseMatch = phraseRegex.exec(text)) !== null) {
          // Check if this position is already matched (check for overlap)
          const matchStart = phraseMatch.index
          const matchEnd = phraseMatch.index + phraseMatch[0].length
          const isAlreadyMatched = matches.some(m => {
            const mStart = m.index
            const mEnd = m.index + m.length
            // Check if ranges overlap
            return (matchStart >= mStart && matchStart < mEnd) || 
                   (matchEnd > mStart && matchEnd <= mEnd) ||
                   (matchStart < mStart && matchEnd > mEnd)
          })
          if (!isAlreadyMatched) {
            // Use technical-term for specific phrases that should be blue
            const isBluePhrase = phrase === 'trustworthy engineer' || 
                                 phrase === 'small group of people' || 
                                 phrase === 'fits her best' ||
                                 phrase === '工程师' ||
                                 phrase === '一小部分人' ||
                                 phrase === '最适合她的'
            matches.push({ 
              index: phraseMatch.index, 
              length: phraseMatch[0].length, 
              className: isBluePhrase ? 'technical-term' : 'emphasis' 
            })
          }
        }
      })
      
      // Sort matches by index
      matches.sort((a, b) => a.index - b.index)
      
      // Build parts array
      matches.forEach(match => {
        if (match.index > lastIndex) {
          parts.push({ text: text.substring(lastIndex, match.index), className: '' })
        }
        parts.push({ text: text.substring(match.index, match.index + match.length), className: match.className })
        lastIndex = match.index + match.length
      })
      
      if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex), className: '' })
      }
      
      if (parts.length === 0) {
        parts.push({ text: line, className: '' })
      }
      
      return (
        <div key={lineNum} className="editor-line">
          <span className="line-number">{lineNum}</span>
          <span className="line-content">
            {parts.map((part, idx) => (
              <span key={idx} className={part.className}>
                {part.text}
              </span>
            ))}
          </span>
        </div>
      )
    }

    if (currentPage === 'skills') {
      if (line === '[UNITY_LOGO]') {
        return (
          <div 
            key={lineNum} 
            className="editor-line skills-logo-line-first skills-category-row unity-row"
          >
            <span className="line-number">{lineNum}</span>
            <span className="line-content">
              <div className="skills-logo-container">
                <span className="logo-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Unity.png')} 
                    alt="Unity" 
                    className={`skills-logo unity-logo ${loadedImages.has(getPublicPath('tech-logos/Unity.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Unity.png')))}
                  />
                  <span className="logo-tooltip">Unity</span>
                </span>
              </div>
              <div className="skills-category-indicator">
                <div className="skills-category-line"></div>
                <span className="skills-category-label">{selectedHumanLang === '简体中文' ? '游戏引擎' : 'Game Engine'}</span>
              </div>
            </span>
          </div>
        )
      }
      if (line === '[PM_LOGOS]') {
        return (
          <div 
            key={lineNum} 
            className="editor-line skills-category-row pm-design-row"
          >
            <span className="line-number">{lineNum}</span>
            <span className="line-content">
              <div className="skills-logo-container">
                <span className="logo-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Jira.png')} 
                    alt="Jira" 
                    className={`skills-logo pm-logo ${loadedImages.has(getPublicPath('tech-logos/Jira.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Jira.png')))}
                  />
                  <span className="logo-tooltip">Jira</span>
                </span>
                <span className="logo-wrapper miro-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Miro.png')} 
                    alt="Miro" 
                    className={`skills-logo pm-logo miro-logo ${loadedImages.has(getPublicPath('tech-logos/Miro.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Miro.png')))}
                  />
                  <span className="logo-tooltip">Miro</span>
                </span>
                <span className="logo-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Figma.png')} 
                    alt="Figma" 
                    className={`skills-logo pm-logo ${loadedImages.has(getPublicPath('tech-logos/Figma.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Figma.png')))}
                  />
                  <span className="logo-tooltip">Figma</span>
                </span>
                <span className="logo-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Lark.png')} 
                    alt="Lark" 
                    className={`skills-logo pm-logo lark-logo ${loadedImages.has(getPublicPath('tech-logos/Lark.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Lark.png')))}
                  />
                  <span className="logo-tooltip">Lark</span>
                </span>
              </div>
              <div className="skills-category-indicator">
                <div className="skills-category-line"></div>
                <span className="skills-category-label">{selectedHumanLang === '简体中文' ? '项目管理/设计' : 'PM/Design'}</span>
              </div>
            </span>
          </div>
        )
      }
      if (line === '[FRAMEWORK_LOGOS]') {
        return (
          <div 
            key={lineNum} 
            className="editor-line skills-logo-line-first skills-category-row framework-row"
          >
            <span className="line-number">{lineNum}</span>
            <span className="line-content">
              <div className="skills-logo-container">
                <span className="logo-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/SpringBoot.png')} 
                    alt="Spring Boot" 
                    className={`skills-logo backend-logo ${loadedImages.has(getPublicPath('tech-logos/SpringBoot.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/SpringBoot.png')))}
                  />
                  <span className="logo-tooltip">Spring Boot</span>
                </span>
                <span className="logo-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Kitex.png')} 
                    alt="Kitex" 
                    className={`skills-logo backend-logo kitex-logo ${loadedImages.has(getPublicPath('tech-logos/Kitex.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Kitex.png')))}
                  />
                  <a
                    href="https://www.cloudwego.io/docs/kitex/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="logo-tooltip logo-tooltip-link"
                  >
                    Kitex(Go RPC)
                  </a>
                </span>
              </div>
              <div className="skills-category-indicator">
                <div className="skills-category-line"></div>
                <span className="skills-category-label">{selectedHumanLang === '简体中文' ? '框架' : 'Framework'}</span>
              </div>
            </span>
          </div>
        )
      }
      if (line === '[DATABASE_LOGOS]') {
        return (
          <div 
            key={lineNum} 
            className="editor-line skills-category-row db-row"
          >
            <span className="line-number">{lineNum}</span>
            <span className="line-content">
              <div className="skills-logo-container">
                <span className="logo-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/MySQL.png')} 
                    alt="MySQL" 
                    className={`skills-logo backend-logo mysql-logo ${loadedImages.has(getPublicPath('tech-logos/MySQL.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/MySQL.png')))}
                  />
                  <span className="logo-tooltip">MySQL</span>
                </span>
                <span className="logo-wrapper redis-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Redis.png')} 
                    alt="Redis" 
                    className={`skills-logo backend-logo redis-logo ${loadedImages.has(getPublicPath('tech-logos/Redis.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Redis.png')))}
                  />
                  <span className="logo-tooltip">Redis</span>
                </span>
                <span className="logo-wrapper mongodb-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/MongoDB.png')} 
                    alt="MongoDB" 
                    className={`skills-logo backend-logo mongodb-logo ${loadedImages.has(getPublicPath('tech-logos/MongoDB.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/MongoDB.png')))}
                  />
                  <span className="logo-tooltip">MongoDB</span>
                </span>
              </div>
              <div className="skills-category-indicator">
                <div className="skills-category-line"></div>
                <span className="skills-category-label">{selectedHumanLang === '简体中文' ? '中间件/数据库' : 'Middleware/DB'}</span>
              </div>
            </span>
          </div>
        )
      }
      if (line === '[MQ_LOGOS]') {
        return (
          <div 
            key={lineNum} 
            className="editor-line skills-category-row mq-row"
          >
            <span className="line-number">{lineNum}</span>
            <span className="line-content">
              <div className="skills-logo-container">
                <span className="logo-wrapper rocketmq-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/RocketMQ.png')} 
                    alt="RocketMQ" 
                    className={`skills-logo backend-logo rocketmq-logo ${loadedImages.has(getPublicPath('tech-logos/RocketMQ.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/RocketMQ.png')))}
                  />
                  <span className="logo-tooltip">RocketMQ</span>
                </span>
                <span className="logo-wrapper rabbitmq-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/RabbitMQ.png')} 
                    alt="RabbitMQ" 
                    className={`skills-logo backend-logo rabbitmq-logo ${loadedImages.has(getPublicPath('tech-logos/RabbitMQ.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/RabbitMQ.png')))}
                  />
                  <span className="logo-tooltip">RabbitMQ</span>
                </span>
                <span className="logo-wrapper kafka-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Kafka.png')} 
                    alt="Kafka" 
                    className={`skills-logo backend-logo kafka-logo ${loadedImages.has(getPublicPath('tech-logos/Kafka.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Kafka.png')))}
                  />
                  <span className="logo-tooltip">Kafka</span>
                </span>
              </div>
              <div className="skills-category-indicator">
                <div className="skills-category-line"></div>
                <span className="skills-category-label">{selectedHumanLang === '简体中文' ? '中间件/消息队列' : 'Middleware/MQ'}</span>
              </div>
            </span>
          </div>
        )
      }
      if (line === '[GIT_LOGO]') {
        return (
          <div 
            key={lineNum} 
            className="editor-line skills-logo-line-first git-logo-line skills-category-row devops-row"
          >
            <span className="line-number">{lineNum}</span>
            <span className="line-content">
              <div className="skills-logo-container">
                <span className="logo-wrapper git-wrapper">
                  <img 
                    src={getPublicPath('tech-logos/Git.png')} 
                    alt="Git" 
                    className={`skills-logo git-logo ${loadedImages.has(getPublicPath('tech-logos/Git.png')) ? 'loaded' : ''}`}
                    onLoad={() => setLoadedImages(prev => new Set(prev).add(getPublicPath('tech-logos/Git.png')))}
                  />
                  <span className="logo-tooltip">Git</span>
                </span>
              </div>
              <div className="skills-category-indicator">
                <div className="skills-category-line"></div>
                <span className="skills-category-label">{selectedHumanLang === '简体中文' ? '运维开发/持续集成与部署' : 'DevOps/CI/CD'}</span>
              </div>
            </span>
          </div>
        )
      }
      // Regular text rendering for skills page
      if (line && (line === 'Game Dev:' || line === 'Backend Dev:' || line === '游戏开发：' || line === '后端开发：')) {
        return (
          <div key={lineNum} className="editor-line">
            <span className="line-number">{lineNum}</span>
            <span className="line-content">
              <span className="section-title">{line}</span>
            </span>
          </div>
        )
      }
      return (
        <div key={lineNum} className="editor-line">
          <span className="line-number">{lineNum}</span>
          <span className="line-content">{line}</span>
        </div>
      )
    }

    if (currentPage === 'games') {
      if (line === '[GAMES_PROJECTS]') {
        return (
          <div key={lineNum} className="editor-line games-projects-line">
            <span className="line-content">
              <div className="games-projects-container">
                {/* Three Sins Project */}
                <div 
                  className={`game-project ${highlightedGame === 'three-sins' ? 'highlighted' : ''}`}
                  onMouseEnter={() => setHighlightedGame('three-sins')}
                  onMouseLeave={() => setHighlightedGame(null)}
                >
                  <img 
                    src={threeSinsCover} 
                    alt="Global Game Jam 2025 - Three Sins" 
                    className="game-cover-image"
                    onClick={() => handlePageClick('three-sins')}
                  />
                  <div className="game-project-info">
                    <div className="game-title">Global Game Jam 2025 - {selectedHumanLang === '简体中文' ? '《三毒》' : 'Three Sins'}</div>
                    <div className="game-role">
                      <span>{selectedHumanLang === '简体中文' ? '程序员' : 'Programmer'}</span>
                      <span className="game-tech-icons">
                        <img src={getPublicPath('tech-logos/Unity.png')} alt="Unity" className="game-tech-icon" />
                        <img src={getPublicPath('tech-logos/Csharp.png')} alt="C#" className="game-tech-icon" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Smile Recovery Project */}
                <div 
                  className={`game-project ${highlightedGame === 'smile-recovery' ? 'highlighted' : ''}`}
                  onMouseEnter={() => setHighlightedGame('smile-recovery')}
                  onMouseLeave={() => setHighlightedGame(null)}
                >
                  <img 
                    src={smileRecoveryCover} 
                    alt="Global Game Jam 2024 - Smile Recovery" 
                    className="game-cover-image"
                    onClick={() => handlePageClick('smile-recovery')}
                  />
                  <div className="game-project-info">
                    <div className="game-title">Global Game Jam 2024 - {selectedHumanLang === '简体中文' ? '《笑脸康复工程》' : 'Smile Recovery'}</div>
                    <div className="game-role">
                      <span>{selectedHumanLang === '简体中文' ? '音乐音效' : 'Audio Designer'}</span>
                      <span className="game-tech-icons">
                        <img src={getPublicPath('tech-logos/Unity.png')} alt="Unity" className="game-tech-icon" />
                        <img src={getPublicPath('tech-logos/Csharp.png')} alt="C#" className="game-tech-icon" />
                      </span>
                    </div>
                    <div className="game-award">
                      <span className="award-icon">🏆</span>
                      <span>{selectedHumanLang === '简体中文' ? '获奖作品' : 'Award-Winning Project'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>
        )
      }
      const isEmpty = !line || line.trim() === ''
      return (
        <div key={lineNum} className={`editor-line games-projects-line ${isEmpty ? 'empty-line' : ''}`}>
          <span className="line-content">{line}</span>
        </div>
      )
    }

    if (currentPage === 'three-sins') {
      if (line === '[THREE_SINS_CONTENT]') {
        const youtubeVideoId = 'bpYohHgXvnE'
        const youtubeThumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
        const threeSinsMedia = [
          { type: 'video' as const, videoId: youtubeVideoId, thumbnail: youtubeThumbnail },
          { type: 'image' as const, src: threeSinsCover },
          { type: 'image' as const, src: threeSinsContent2 },
          { type: 'image' as const, src: threeSinsContent1 },
          { type: 'image' as const, src: threeSinsContent3 }
        ]
        const currentMedia = threeSinsMedia[threeSinsImageIndex]
        const prevImageIndex = threeSinsImageIndex === 0 ? threeSinsMedia.length - 1 : threeSinsImageIndex - 1
        const nextImageIndex = threeSinsImageIndex === threeSinsMedia.length - 1 ? 0 : threeSinsImageIndex + 1
        const prevMedia = threeSinsMedia[prevImageIndex]
        const nextMedia = threeSinsMedia[nextImageIndex]

        return (
          <div key={lineNum} className="editor-line three-sins-content-line">
            <span className="line-content">
              <div className="three-sins-container">
                {/* Image Preview Section */}
                <div className="three-sins-image-section">
                  <div className="three-sins-carousel">
                    {/* Left Preview (Previous Media) */}
                    <div 
                      className={`three-sins-preview-left ${hoveredNavButton === 'left' ? 'highlighted' : ''}`}
                      onClick={() => setThreeSinsImageIndex(prevImageIndex)}
                    >
                      <img 
                        src={prevMedia.type === 'video' ? prevMedia.thumbnail : prevMedia.src} 
                        alt="Previous" 
                        className="three-sins-preview-image" 
                      />
                    </div>

                    {/* Main Media */}
                    <div className="three-sins-main-image-container">
                      <button
                        className="three-sins-nav-button three-sins-nav-left"
                        onClick={() => setThreeSinsImageIndex(prevImageIndex)}
                        onMouseEnter={() => setHoveredNavButton('left')}
                        onMouseLeave={() => setHoveredNavButton(null)}
                        aria-label="Previous media"
                      >
                        ‹
                      </button>
                      {currentMedia.type === 'video' ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${currentMedia.videoId}`}
                          className="three-sins-main-video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Three Sins Game Video"
                        />
                      ) : (
                        <img src={currentMedia.src} alt="Three Sins Game Screenshot" className="three-sins-main-image" />
                      )}
                      <button
                        className="three-sins-nav-button three-sins-nav-right"
                        onClick={() => setThreeSinsImageIndex(nextImageIndex)}
                        onMouseEnter={() => setHoveredNavButton('right')}
                        onMouseLeave={() => setHoveredNavButton(null)}
                        aria-label="Next media"
                      >
                        ›
                      </button>
                    </div>

                    {/* Right Preview (Next Media) */}
                    <div 
                      className={`three-sins-preview-right ${hoveredNavButton === 'right' ? 'highlighted' : ''}`}
                      onClick={() => setThreeSinsImageIndex(nextImageIndex)}
                    >
                      <img 
                        src={nextMedia.type === 'video' ? nextMedia.thumbnail : nextMedia.src} 
                        alt="Next" 
                        className="three-sins-preview-image" 
                      />
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  <div className="three-sins-thumbnails">
                    {threeSinsMedia.map((media, idx) => (
                      <div
                        key={idx}
                        className={`three-sins-thumbnail ${idx === threeSinsImageIndex ? 'active' : ''}`}
                        onClick={() => setThreeSinsImageIndex(idx)}
                      >
                        <img 
                          src={media.type === 'video' ? media.thumbnail : media.src} 
                          alt={media.type === 'video' ? 'Three Sins Video' : `Three Sins ${idx}`} 
                        />
                        {media.type === 'video' && (
                          <div className="thumbnail-play-icon">▶</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Sections */}
                <div className="three-sins-info-sections">
                  {/* Row 1: Game Details & Global Game Jam 2025 */}
                  <div className="three-sins-info-panel">
                    <div className="three-sins-panel-header">{selectedHumanLang === '简体中文' ? '游戏详情' : 'Game Details'}</div>
                    <div className="three-sins-panel-content">
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '名称：' : 'Title:'}</span> <span>{selectedHumanLang === '简体中文' ? '《三毒》' : 'Three Sins'}</span></div>
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '类型：' : 'Genre:'}</span> <span>{selectedHumanLang === '简体中文' ? '2D、动作冒险、平台跳跃' : '2D, Action-Adventure, Platformer'}</span></div>
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '标签：' : 'Tags:'}</span> <span>{selectedHumanLang === '简体中文' ? '休闲、象征隐喻' : 'Casual, Symbolism'}</span></div>
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '平台：' : 'Platform:'}</span> <span>Windows</span></div>
                    </div>
                  </div>

                  <div className="three-sins-info-panel">
                    <div className="three-sins-panel-header-with-badge">
                      <div className="three-sins-panel-header">Global Game Jam 2025</div>
                      <span className="three-sins-official-badge">{selectedHumanLang === '简体中文' ? '参赛作品' : 'Official Entry'}</span>
                    </div>
                    <div className="three-sins-panel-content">
                      <div>
                        <span className="three-sins-label">{selectedHumanLang === '简体中文' ? '主题：' : 'Theme:'}</span> <span>Bubble</span>
                      </div>
                      <div>
                        <span className="three-sins-label">{selectedHumanLang === '简体中文' ? '作品页面：' : 'Project Page:'}</span> <span><a href="https://globalgamejam.org/games/2025/three-sins-4" target="_blank" rel="noopener noreferrer" className="three-sins-link">globalgamejam.org/games/2025/three-sins-4</a></span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Game Description & Development */}
                  <div className="three-sins-info-panel">
                    <div className="three-sins-panel-header">{selectedHumanLang === '简体中文' ? '游戏简介' : 'Game Description'}</div>
                    <div className="three-sins-panel-content">
                      {selectedHumanLang === '简体中文' ? (
                        <>
                          <div className="three-sins-description-italic">泡沫是幻妄。泡沫是执念。泡沫是痴梦。戳破他们！</div>
                          <div style={{ marginTop: '1em' }}></div>
                          <div>你从沉睡中醒来，却发现所有人都陷入梦中——</div>
                          <div style={{ marginTop: '-0.4em' }}>他们执着于种种幻象与欲望，就像被困在培养皿里的大脑。</div>
                          <div style={{ marginTop: '-0.4em' }}>你决定潜入他们的「意识之海」，去唤醒他们。</div>
                          <div style={{ marginTop: '1em' }}></div>
                          <div>玩家将使用 <span style={{ fontWeight: '700' }}>WASD</span> 控制自己泡沫化的潜意识，在梦境中前行，</div>
                          <div style={{ marginTop: '-0.4em' }}>通过触及他人的核心贪欲来解放他们。</div>
                          <div style={{ marginTop: '-0.4em' }}>途中要小心避开尖刺，合理使用强化道具！</div>
                          <div style={{ marginTop: '-0.4em' }}>但请记住——你保持清醒的时间有限。</div>
                        </>
                      ) : (
                        <>
                          <div className="three-sins-description-italic">Bubble is delusion. Bubble is obsession. Bubble is dream. WAKE THEM UP!</div>
                          <div>You wake up from your sleep to find everyone asleep, holding on to all sorts of obsessions and dreams, like a brain in a vat. You decide to dive into their "sea of consciousness" and wake them up. ......</div>
                          <div>Players use <span className="three-sins-wasd-bold">WASD</span> to control their bubbled subconscious self and free the others by reaching their deepest obsessions. Avoid any spikes and use power-ups wisely! But remember, you only have limited time to keep conscious!</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="three-sins-info-panel">
                    <div className="three-sins-panel-header">{selectedHumanLang === '简体中文' ? '开发信息' : 'Production'}</div>
                    <div className="three-sins-panel-content">
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '团队大小：' : 'Team Size:'}</span> <span>11</span></div>
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '她的角色：' : 'Her Role:'}</span> <span>{selectedHumanLang === '简体中文' ? '程序员' : 'Programmer'}</span></div>
                      <div className="three-sins-tech-tools">
                        <span className="three-sins-label">{selectedHumanLang === '简体中文' ? '技术实现：' : 'Tech & Tools:'}</span>
                        <span className="three-sins-tech-icons">
                          <span className="game-tech-icon-wrapper">
                            <img src={getPublicPath('tech-logos/Unity.png')} alt="Unity" className="three-sins-tech-icon" />
                            <span className="game-tech-tooltip">Unity</span>
                          </span>
                          <span className="game-tech-icon-wrapper">
                            <img src={getPublicPath('tech-logos/Csharp.png')} alt="C#" className="three-sins-tech-icon" />
                            <span className="game-tech-tooltip">C#</span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>
        )
      }
      const isEmpty = !line || line.trim() === ''
      return (
        <div key={lineNum} className={`editor-line three-sins-content-line ${isEmpty ? 'empty-line' : ''}`}>
          <span className="line-content">{line}</span>
        </div>
      )
    }

    if (currentPage === 'smile-recovery') {
      if (line === '[SMILE_RECOVERY_CONTENT]') {
        const bilibiliVideoUrl = 'https://player.bilibili.com/player.html?aid=539426361&bvid=BV1Yi4y1p7gh&cid=1423636079&p=1'
        const smileRecoveryMedia = [
          { type: 'video' as const, videoUrl: bilibiliVideoUrl, thumbnail: smileRecoveryVideo },
          { type: 'image' as const, src: smileRecoveryCover },
          { type: 'image' as const, src: smileRecoveryContent3 },
          { type: 'image' as const, src: smileRecoveryContent1 },
          { type: 'image' as const, src: smileRecoveryContent2 }
        ]
        const currentMedia = smileRecoveryMedia[smileRecoveryImageIndex]
        const prevImageIndex = smileRecoveryImageIndex === 0 ? smileRecoveryMedia.length - 1 : smileRecoveryImageIndex - 1
        const nextImageIndex = smileRecoveryImageIndex === smileRecoveryMedia.length - 1 ? 0 : smileRecoveryImageIndex + 1
        const prevMedia = smileRecoveryMedia[prevImageIndex]
        const nextMedia = smileRecoveryMedia[nextImageIndex]

        return (
          <div key={lineNum} className="editor-line three-sins-content-line">
            <span className="line-content">
              <div className="three-sins-container">
                {/* Image Preview Section */}
                <div className="three-sins-image-section">
                  <div className="three-sins-carousel">
                    {/* Left Preview (Previous Media) */}
                    <div 
                      className={`three-sins-preview-left ${hoveredNavButton === 'left' ? 'highlighted' : ''}`}
                      onClick={() => setSmileRecoveryImageIndex(prevImageIndex)}
                    >
                      <img 
                        src={prevMedia.type === 'video' ? prevMedia.thumbnail : prevMedia.src} 
                        alt="Previous" 
                        className="three-sins-preview-image" 
                      />
                    </div>

                    {/* Main Media */}
                    <div className="three-sins-main-image-container">
                      <button
                        className="three-sins-nav-button three-sins-nav-left"
                        onClick={() => setSmileRecoveryImageIndex(prevImageIndex)}
                        onMouseEnter={() => setHoveredNavButton('left')}
                        onMouseLeave={() => setHoveredNavButton(null)}
                        aria-label="Previous media"
                      >
                        ‹
                      </button>
                      {currentMedia.type === 'video' ? (
                        <div className="three-sins-video-wrapper">
                          <iframe
                            src={currentMedia.videoUrl}
                            className="three-sins-main-video"
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen
                            title="Smile Recovery Game Video"
                          />
                          <div className="smile-recovery-volume-hint">
                            <div className="volume-hint-arrow">↑</div>
                          </div>
                        </div>
                      ) : (
                        <img src={currentMedia.src} alt="Smile Recovery Game Screenshot" className="three-sins-main-image" />
                      )}
                      <button
                        className="three-sins-nav-button three-sins-nav-right"
                        onClick={() => setSmileRecoveryImageIndex(nextImageIndex)}
                        onMouseEnter={() => setHoveredNavButton('right')}
                        onMouseLeave={() => setHoveredNavButton(null)}
                        aria-label="Next media"
                      >
                        ›
                      </button>
                    </div>

                    {/* Right Preview (Next Media) */}
                    <div 
                      className={`three-sins-preview-right ${hoveredNavButton === 'right' ? 'highlighted' : ''}`}
                      onClick={() => setSmileRecoveryImageIndex(nextImageIndex)}
                    >
                      <img 
                        src={nextMedia.type === 'video' ? nextMedia.thumbnail : nextMedia.src} 
                        alt="Next" 
                        className="three-sins-preview-image" 
                      />
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  <div className="three-sins-thumbnails">
                    {smileRecoveryMedia.map((media, idx) => (
                      <div
                        key={idx}
                        className={`three-sins-thumbnail ${idx === smileRecoveryImageIndex ? 'active' : ''}`}
                        onClick={() => setSmileRecoveryImageIndex(idx)}
                      >
                        <img 
                          src={media.type === 'video' ? media.thumbnail : media.src} 
                          alt={media.type === 'video' ? 'Smile Recovery Video' : `Smile Recovery ${idx + 1}`} 
                        />
                        {media.type === 'video' && (
                          <div className="thumbnail-play-icon">▶</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Sections */}
                <div className="three-sins-info-sections">
                  {/* Row 1: Game Details & Global Game Jam 2024 */}
                  <div className="three-sins-info-panel">
                    <div className="three-sins-panel-header">{selectedHumanLang === '简体中文' ? '游戏详情' : 'Game Details'}</div>
                    <div className="three-sins-panel-content">
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '名称：' : 'Title:'}</span> <span>{selectedHumanLang === '简体中文' ? '《笑脸康复工程》' : 'Smile Recovery'}</span></div>
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '类型：' : 'Genre:'}</span> <span>{selectedHumanLang === '简体中文' ? '2D、点触解谜、推理' : '2D, Point-and-Click Puzzle, Mystery'}</span></div>
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '标签：' : 'Tags:'}</span> <span>{selectedHumanLang === '简体中文' ? '心理、现实、剪纸画风' : 'Psychological, Realism, Handcrafted Art'}</span></div>
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '平台：' : 'Platform:'}</span> <span>Windows</span></div>
                    </div>
                  </div>

                  <div className="three-sins-info-panel">
                    <div className="three-sins-panel-header-with-badge">
                      <div className="three-sins-panel-header">Global Game Jam 2024</div>
                      <span className="three-sins-official-badge">{selectedHumanLang === '简体中文' ? '参赛作品' : 'Official Entry'}</span>
                    </div>
                    <div className="three-sins-panel-content">
                      <div>
                        <span className="three-sins-label">{selectedHumanLang === '简体中文' ? '主题：' : 'Theme:'}</span> <span>Make Me Laugh</span>
                      </div>
                      <div>
                        <span className="three-sins-label">{selectedHumanLang === '简体中文' ? '作品页面：' : 'Project Page:'}</span> <span><a href="https://lichbird.itch.io/2" target="_blank" rel="noopener noreferrer" className="three-sins-link">itch.io</a></span>
                      </div>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '400', fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif' }}>
                          {selectedHumanLang === '简体中文' ? (
                            <>🏆 <span style={{ color: '#e6b450' }}>冠军</span> — 成都站，本地<a href="https://cbgc.scol.com.cn/news/4724964?from=androidapp&app_id=cbgc&localTimeStamp=1706518167757" target="_blank" rel="noopener noreferrer" className="three-sins-link" style={{ fontSize: '12px', color: '#9ca3af' }}>新闻报道</a></>
                          ) : (
                            <>🏆 <span style={{ color: '#e6b450' }}>1st Place</span> — Chengdu Site, Featured on <a href="https://cbgc.scol.com.cn/news/4724964?from=androidapp&app_id=cbgc&localTimeStamp=1706518167757" target="_blank" rel="noopener noreferrer" className="three-sins-link" style={{ fontSize: '12px', color: '#9ca3af' }}>local news</a></>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Game Description & Production */}
                  <div className="three-sins-info-panel">
                    <div className="three-sins-panel-header">{selectedHumanLang === '简体中文' ? '游戏简介' : 'Game Description'}</div>
                    <div className="three-sins-panel-content">
                      {selectedHumanLang === '简体中文' ? (
                        <>
                          <div style={{ fontStyle: 'italic' }}>孩子不笑了怎么办？笑脸医生来帮您！</div>
                          <div style={{ marginTop: '1em' }}></div>
                          <div>玩家将会扮演一名医生，帮助家长"治愈"他们的问题孩子，让他们重新绽放笑容。</div>
                          <div style={{ marginTop: '-0.4em' }}>利用你手中的<span style={{ fontWeight: '700' }}>剪刀</span>与<span style={{ fontWeight: '700' }}>胶水</span>，深入每个孩子的故事，揭开他们沉默背后的秘密。</div>
                          <div style={{ marginTop: '1em' }}></div>
                          <div>在手帐般的关卡场景中，你需要从环境中剪切、粘贴线索，拼出一幅残缺的拼图——</div>
                          <div style={{ marginTop: '-0.4em' }}>每一块拼图都映射着孩子的思绪、痛苦，或他们失笑的根源。</div>
                          <div style={{ marginTop: '1em' }}></div>
                          <div>然而，当你一块块拼合他们的笑脸时，一个问题渐渐浮现：</div>
                          <div style={{ marginTop: '-0.4em' }}>你是在真正治愈他们，还是在塑造一个家长所期望的"完美孩子"？</div>
                          <div style={{ marginTop: '-0.4em' }}>人究竟是为何而笑？又该为何而笑？</div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontStyle: 'italic' }}>What if your child stopped smiling? Don't worry — the Smile Doctor is here to help.</div>
                          <div style={{ marginTop: '1em' }}></div>
                          <div>In <span style={{ fontStyle: 'italic' }}>Smile Recovery</span>, you play as a doctor who helps parents "cure" their troubled children and bring back their lost smiles. Using your trusty <span style={{ fontWeight: '700' }}>scissors</span> and <span style={{ fontWeight: '700' }}>glue</span>, you'll dive into each story and uncover the secrets behind every child's silence.</div>
                          <div style={{ marginTop: '1em' }}></div>
                          <div>Within the scrapbook-like stages, you cut and paste clues from the environment to complete the missing pieces of a puzzle — each piece reflecting a fragment of the child's thoughts, their pain, or the root cause of their sorrow.</div>
                          <div style={{ marginTop: '1em' }}></div>
                          <div>Yet as you stitch their faces back together, a question begins to surface: Are you truly healing them — or simply shaping them into what their parents desire? What makes a person smile? And what should they smile for?</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="three-sins-info-panel">
                    <div className="three-sins-panel-header">{selectedHumanLang === '简体中文' ? '开发信息' : 'Production'}</div>
                    <div className="three-sins-panel-content">
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '团队大小：' : 'Team Size:'}</span> <span>7</span></div>
                      <div><span className="three-sins-label">{selectedHumanLang === '简体中文' ? '她的角色：' : 'Her Role:'}</span> <span>{selectedHumanLang === '简体中文' ? '音乐音效' : 'Audio Designer'}</span></div>
                      <div className="three-sins-tech-tools">
                        <span className="three-sins-label">{selectedHumanLang === '简体中文' ? '技术实现：' : 'Tech & Tools:'}</span>
                        <span className="three-sins-tech-icons">
                          <span className="game-tech-icon-wrapper">
                            <img src={getPublicPath('tech-logos/Unity.png')} alt="Unity" className="three-sins-tech-icon" />
                            <span className="game-tech-tooltip">Unity</span>
                          </span>
                          <span className="game-tech-icon-wrapper">
                            <img src={getPublicPath('tech-logos/Csharp.png')} alt="C#" className="three-sins-tech-icon" />
                            <span className="game-tech-tooltip">C#</span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>
        )
      }
      const isEmpty = !line || line.trim() === ''
      return (
        <div key={lineNum} className={`editor-line three-sins-content-line ${isEmpty ? 'empty-line' : ''}`}>
          <span className="line-content">{line}</span>
        </div>
      )
    }
    
    // Java comment style for pages with "Coming soon" or "快了" message
    if (line && (line.includes("Coming soon — she's debugging reality") || line.includes("// 快了 —— 她最近在debug现实"))) {
      return (
        <div key={lineNum} className="editor-line">
          <span className="line-number">{lineNum}</span>
          <span className="line-content java-comment">{line}</span>
        </div>
      )
    }
    
    // Experience page
    if (currentPage === 'experience' && line) {
      const parts: Array<{ text: string; className: string }> = []
      let text = line
      let lastIndex = 0
      
      // Find all matches for different syntax elements
      const matches: Array<{ index: number; length: number; className: string }> = []
      
      // Find section titles (Education:, Professional:, 教育背景：, 职业经历：) - section titles
      const sectionRegex = /^(Education|Professional|教育背景|职业经历)[：:]/g
      let sectionMatch
      while ((sectionMatch = sectionRegex.exec(text)) !== null) {
        matches.push({ index: sectionMatch.index, length: sectionMatch[0].length, className: 'section-title' })
      }
      
      // Find comments (// ...) - java comment (gray) - match first to ensure comments are gray
      const commentRegex = /\/\/.*$/g
      let commentMatch
      while ((commentMatch = commentRegex.exec(text)) !== null) {
        matches.push({ index: commentMatch.index, length: commentMatch[0].length, className: 'java-comment' })
      }
      
      // Helper function to check if a position is within a comment
      const isInComment = (index: number, length: number) => {
        return matches.some(m => 
          m.className === 'java-comment' &&
          index >= m.index && 
          index + length <= m.index + m.length
        )
      }
      
      // Find proper nouns (Columbia University, ESCP Business School, ByteDance, Ubisoft, 哥伦比亚大学, 欧洲高等商学院, 字节跳动, 育碧) - proper noun
      // Match Chinese proper nouns separately (without word boundaries)
      const chineseProperNouns = ['哥伦比亚大学', '欧洲高等商学院', '字节跳动', '育碧']
      chineseProperNouns.forEach(noun => {
        const nounRegex = new RegExp(noun.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        let nounMatch: RegExpExecArray | null
        while ((nounMatch = nounRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            nounMatch!.index >= m.index && nounMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched && !isInComment(nounMatch.index, nounMatch[0].length)) {
            matches.push({ index: nounMatch.index, length: nounMatch[0].length, className: 'proper-noun' })
          }
        }
      })
      
      // Match English proper nouns with word boundaries
      const englishProperNounRegex = /\b(Columbia University|ESCP Business School|ByteDance|Ubisoft)\b/g
      let properNounMatch: RegExpExecArray | null
      while ((properNounMatch = englishProperNounRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          properNounMatch!.index >= m.index && properNounMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(properNounMatch.index, properNounMatch[0].length)) {
          matches.push({ index: properNounMatch.index, length: properNounMatch[0].length, className: 'proper-noun' })
        }
      }
      
      // Find technical terms (B.A., B.S., Computer Science, Management, 计算机科学, 管理学) - but not Intern (should be default white)
      // Note: 本科 is handled separately as a connector word (purple)
      // Match Chinese technical terms separately (without word boundaries)
      const chineseTechnicalTerms = ['计算机科学', '管理学']
      chineseTechnicalTerms.forEach(term => {
        const termRegex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        let termMatch: RegExpExecArray | null
        while ((termMatch = termRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            termMatch!.index >= m.index && termMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched && !isInComment(termMatch.index, termMatch[0].length)) {
            matches.push({ index: termMatch.index, length: termMatch[0].length, className: 'technical-term' })
          }
        }
      })
      
      // Match English technical terms with word boundaries
      const englishTechnicalTermRegex = /\b(B\.A\.|B\.S\.|Computer Science|Management)\b/g
      let technicalTermMatch: RegExpExecArray | null
      while ((technicalTermMatch = englishTechnicalTermRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          technicalTermMatch!.index >= m.index && technicalTermMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(technicalTermMatch.index, technicalTermMatch[0].length)) {
          matches.push({ index: technicalTermMatch.index, length: technicalTermMatch[0].length, className: 'technical-term' })
        }
      }
      
      // Find "SWE" and "PM" separately (before Intern) - technical terms, also 后端开发 and 项目管理
      // Match Chinese job types separately (without word boundaries)
      const chineseJobTypes = ['后端开发', '项目管理']
      chineseJobTypes.forEach(jobType => {
        const jobTypeRegex = new RegExp(jobType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        let jobTypeMatch: RegExpExecArray | null
        while ((jobTypeMatch = jobTypeRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            jobTypeMatch!.index >= m.index && jobTypeMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched && !isInComment(jobTypeMatch.index, jobTypeMatch[0].length)) {
            matches.push({ index: jobTypeMatch.index, length: jobTypeMatch[0].length, className: 'technical-term' })
          }
        }
      })
      
      // Match English job types with word boundaries
      const englishJobTypeRegex = /\b(SWE|PM)\b/g
      let englishJobTypeMatch: RegExpExecArray | null
      while ((englishJobTypeMatch = englishJobTypeRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          englishJobTypeMatch!.index >= m.index && englishJobTypeMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(englishJobTypeMatch.index, englishJobTypeMatch[0].length)) {
          matches.push({ index: englishJobTypeMatch.index, length: englishJobTypeMatch[0].length, className: 'technical-term' })
        }
      }
      
      // Find numbers in dates (2025, 2024, May, Aug, 5-8月, 2025年, 2024年) - numbers
      const numberRegex = /\b(2025|2024|May|Aug|5-8月|2025年|2024年)\b/g
      let numberMatch: RegExpExecArray | null
      while ((numberMatch = numberRegex.exec(text)) !== null) {
        const isAlreadyMatched = matches.some(m => 
          numberMatch!.index >= m.index && numberMatch!.index < m.index + m.length
        )
        if (!isAlreadyMatched && !isInComment(numberMatch.index, numberMatch[0].length)) {
          matches.push({ index: numberMatch.index, length: numberMatch[0].length, className: 'number' })
        }
      }
      
      // Find connector words (in) - connector words (purple) - only for English
      // Note: "in" is removed from Chinese version, so we only match it in English context
      // Also match 本科 as a connector word (purple) for Chinese
      if (selectedHumanLang === '简体中文') {
        const chineseConnectorRegex = /本科/g
        let chineseConnectorMatch: RegExpExecArray | null
        while ((chineseConnectorMatch = chineseConnectorRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            chineseConnectorMatch!.index >= m.index && chineseConnectorMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched && !isInComment(chineseConnectorMatch.index, chineseConnectorMatch[0].length)) {
            matches.push({ index: chineseConnectorMatch.index, length: chineseConnectorMatch[0].length, className: 'connector-word' })
          }
        }
      } else {
        const connectorRegex = /\b(in)\b/gi
        let connectorMatch: RegExpExecArray | null
        while ((connectorMatch = connectorRegex.exec(text)) !== null) {
          const isAlreadyMatched = matches.some(m => 
            connectorMatch!.index >= m.index && connectorMatch!.index < m.index + m.length
          )
          if (!isAlreadyMatched && !isInComment(connectorMatch.index, connectorMatch[0].length)) {
            matches.push({ index: connectorMatch.index, length: connectorMatch[0].length, className: 'connector-word' })
          }
        }
      }
      
      // Sort matches by index
      matches.sort((a, b) => a.index - b.index)
      
      // Build parts array
      matches.forEach(match => {
        if (match.index > lastIndex) {
          parts.push({ text: text.substring(lastIndex, match.index), className: '' })
        }
        parts.push({ text: text.substring(match.index, match.index + match.length), className: match.className })
        lastIndex = match.index + match.length
      })
      
      if (lastIndex < text.length) {
        parts.push({ text: text.substring(lastIndex), className: '' })
      }
      
      if (parts.length === 0) {
        parts.push({ text: line, className: '' })
      }
      
      // Add special class for Columbia University line to shift left by 1px
      // Add special class for ESCP line to shift dash right slightly
      const isColumbiaLine = line.includes('哥伦比亚大学')
      const isESCPLine = line.includes('欧洲高等商学院')
      
      return (
        <div key={lineNum} className={`editor-line ${isColumbiaLine ? 'columbia-line' : ''} ${isESCPLine ? 'escp-line' : ''}`}>
          <span className="line-number">{lineNum}</span>
          <span className="line-content">
            {parts.map((part, idx) => (
              <span key={idx} className={part.className}>
                {part.text}
              </span>
            ))}
          </span>
        </div>
      )
    }
    
    // Contact page
    if (currentPage === 'contact' && line) {
      const lang = selectedHumanLang || 'English'
      const contactData = {
        '[CONTACT_EMAIL]': {
          icon: getPublicPath('contact-icons/Gmail.png'),
          platform: lang === '简体中文' ? '邮箱' : 'Email',
          account: 'yvehu02@gmail.com',
          description: lang === '简体中文' ? '// 直接发消息或正式合作' : '// For direct messages or formal collaboration',
          url: 'mailto:yvehu02@gmail.com'
        },
        '[CONTACT_DISCORD]': {
          icon: getPublicPath('contact-icons/Discord.png'),
          platform: 'Discord',
          account: 'jesuisyve02',
          description: lang === '简体中文' ? '// 首选如果想Game Jam组队！' : '// Preferred if for Game Jam team-ups!',
          url: 'https://discord.com/users/967253583093448774'
        },
        '[CONTACT_LINKEDIN]': {
          icon: getPublicPath('contact-icons/Linkedin.png'),
          platform: lang === '简体中文' ? '领英' : 'Linkedin',
          account: 'www.linkedin.com/in/yvehu',
          description: lang === '简体中文' ? '// 在此了解更多她的背景' : '// To learn more about her background',
          url: 'https://www.linkedin.com/in/yvehu/'
        },
        '[CONTACT_INSTAGRAM]': {
          icon: getPublicPath('contact-icons/Instagram.png'),
          platform: 'Instagram',
          account: 'yveh.34',
          description: lang === '简体中文' ? "// 如果你想在纽约一起喝杯咖啡~" : "// If you'd like to grab a coffee in New York~",
          url: 'https://www.instagram.com/yveh.34/?igsh=MXkwYmJpYjZscmd4YQ%3D%3D&utm_source=qr#'
        }
      }
      
      const contact = contactData[line as keyof typeof contactData]
      if (contact) {
        return (
          <div key={lineNum} className="editor-line">
            <span className="line-number">{lineNum}</span>
            <span className="line-content">
              <div className="contact-row">
                <a href={contact.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                <img src={contact.icon} alt={contact.platform} className="contact-icon" />
                </a>
                <div className="contact-info">
                  <a href={contact.url} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <div className="contact-platform">{contact.platform}</div>
                  </a>
                  <div className="contact-details">
                    <span className="contact-account">{contact.account}</span>
                    <span className="contact-description">
                      {contact.description.includes('Preferred') || contact.description.includes('首选') ? (
                        <>
                          {contact.description.split(lang === '简体中文' ? '首选' : 'Preferred').map((part, index) => 
                            index === 0 ? part : (
                              <span key={index}>
                                <strong>{lang === '简体中文' ? '首选' : 'Preferred'}</strong>
                                {part}
                              </span>
                            )
                          )}
                        </>
                      ) : (
                        contact.description
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </span>
          </div>
        )
      }
    }
    
    // Simple rendering for other pages or empty lines
    const isEmpty = !line || line.trim() === ''
    return (
      <div key={lineNum} className={`editor-line ${isEmpty ? 'empty-line' : ''}`}>
        <span className="line-number">{lineNum}</span>
        <span className="line-content">{line}</span>
      </div>
    )
  }

  // Check if a nav item should be active
  const isNavItemActive = (itemId: Page): boolean => {
    if (currentPage === itemId) {
      return true
    }
    // Games should be active when viewing Three Sins or Smile Recovery
    if (itemId === 'games' && (currentPage === 'three-sins' || currentPage === 'smile-recovery')) {
      return true
    }
    return false
  }

  // Group navigation items by parent
  const groupedNavItems = navItems.reduce((acc, item) => {
    if (item.parent) {
      if (!acc[item.parent]) {
        acc[item.parent] = []
      }
      acc[item.parent].push(item)
    }
    return acc
  }, {} as Record<string, NavItem[]>)

  return (
    <div className="app">
      {/* Top Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <img 
            src={getPublicPath('logo-cat.png')} 
            alt="Yve Cat Logo" 
            className="logo"
            onError={(e) => {
              // Fallback if logo doesn't exist
              e.currentTarget.style.display = 'none'
            }}
          />
          <span className="name">Yve Hu</span>
        </div>
        <div className="top-bar-right">
          <div className="language-menu-container" ref={langMenuRef}>
            <button 
              className="language-button"
              onClick={() => {
                setIsLangMenuOpen(!isLangMenuOpen)
                if (isLangMenuOpen) {
                  setExpandedLangCategory(null)
                }
              }}
            >
              {t('Language')} <span className="dropdown-arrow">{isLangMenuOpen ? '▼' : '▶'}</span>
            </button>
            {isLangMenuOpen && (
              <div className="language-menu">
                <div className="lang-category-item">
                  <button
                    className="lang-category-button"
                    onClick={() => setExpandedLangCategory(expandedLangCategory === 'code' ? null : 'code')}
                  >
                    <span className="lang-icon">🤖</span>
                    <span className="lang-arrow">{expandedLangCategory === 'code' ? '▼' : '▶'}</span>
                  </button>
                  {expandedLangCategory === 'code' && (
                    <div className="lang-options-list">
                      {codeLanguages.map(lang => (
                        <button
                          key={lang}
                          className={`lang-option ${selectedCodeLang === lang ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedCodeLang(lang)
                            setIsLangMenuOpen(false)
                            setExpandedLangCategory(null)
                          }}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="lang-category-item">
                  <button
                    className="lang-category-button"
                    onClick={() => setExpandedLangCategory(expandedLangCategory === 'human' ? null : 'human')}
                  >
                    <span className="lang-icon">👤</span>
                    <span className="lang-arrow">{expandedLangCategory === 'human' ? '▼' : '▶'}</span>
                  </button>
                  {expandedLangCategory === 'human' && (
                    <div className="lang-options-list">
                      {humanLanguages.map(lang => (
                        <button
                          key={lang}
                          className={`lang-option ${selectedHumanLang === lang ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedHumanLang(lang)
                            setIsLangMenuOpen(false)
                            setExpandedLangCategory(null)
                          }}
                        >
                          {lang}
        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar" ref={sidebarRef} style={{ width: `${sidebarWidth}px` }}>
          <nav className="file-tree">
            {topLevelFolders.map(folder => {
              const isExpanded = expandedSections.has(folder)
              const items = groupedNavItems[folder] || []
              
              return (
                <div key={folder} className="nav-section">
                  <div
                    className="nav-section-header"
                    onClick={() => toggleSection(folder)}
                  >
                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                    <span className="folder-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2.5" y="4.5" width="11" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="2.5" y="3" width="5" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="7.5" y1="3" x2="7.5" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <span>{t(folder)}</span>
                  </div>
                  {isExpanded && items.length > 0 && (
                    <div className="nav-section-content">
                      {items.map(item => (
                        <div
                          key={item.id}
                          className={`nav-item nested ${isNavItemActive(item.id) ? 'active' : ''}`}
                          onClick={() => handlePageClick(item.id)}
                        >
                          <span className="file-icon">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.5 2.5C3.5 2.22386 3.72386 2 4 2H9.5L12.5 5V13.5C12.5 13.7761 12.2761 14 12 14H4C3.72386 14 3.5 13.7761 3.5 13.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9 2V5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <line x1="5.5" y1="7" x2="10.5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              <line x1="5.5" y1="9.5" x2="9.5" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </span>
                          <span>{t(item.label)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
          <div 
            className="sidebar-resizer"
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizing(true)
            }}
          />
        </aside>

        {/* Right Content Area (Tab Bar + Editor Window) */}
        <div className="right-content-area">
          {/* Tab Bar */}
          {openTabs.length > 0 && (
            <div 
              className="tab-bar"
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                // If dragging over the tab bar container (not a specific tab),
                // check if we're near the end and set dragOverTabIndex to the last tab
                if (draggedTabIndex !== null && openTabs.length > 0) {
                  const x = e.clientX
                  const children = Array.from(e.currentTarget.children) as HTMLElement[]
                  
                  // Find the first tab element (excluding placeholders)
                  let firstTabElement: HTMLElement | null = null
                  for (let i = 0; i < children.length; i++) {
                    if (children[i].classList.contains('tab-item') && !children[i].classList.contains('tab-placeholder')) {
                      firstTabElement = children[i]
                      break
                    }
                  }
                  
                  // Find the last tab element (excluding placeholders)
                  let lastTabElement: HTMLElement | null = null
                  for (let i = children.length - 1; i >= 0; i--) {
                    if (children[i].classList.contains('tab-item') && !children[i].classList.contains('tab-placeholder')) {
                      lastTabElement = children[i]
                      break
                    }
                  }
                  
                  // Check if dragging to start (before first tab)
                  if (firstTabElement) {
                    const firstTabRect = firstTabElement.getBoundingClientRect()
                    if (x < firstTabRect.left + 20) {
                      const firstIndex = 0
                      setIsDraggingToStart(true)
                      setIsDraggingToEnd(false)
                      if (dragOverTabIndex !== firstIndex) {
                        setDragOverTabIndex(firstIndex)
                      }
                      return
                    }
                  }
                  
                  // If mouse is after the last tab, set dragOverTabIndex to last index
                  if (lastTabElement) {
                    const lastTabRect = lastTabElement.getBoundingClientRect()
                    // Check if mouse is after the last tab (with some tolerance)
                    if (x > lastTabRect.right - 20) {
                      const lastIndex = openTabs.length - 1
                      setIsDraggingToEnd(true)
                      setIsDraggingToStart(false)
                      if (dragOverTabIndex !== lastIndex) {
                        setDragOverTabIndex(lastIndex)
                      }
                    } else {
                      // Mouse is before the end, check if we're over the last tab
                      if (x >= lastTabRect.left && x <= lastTabRect.right) {
                        const lastIndex = openTabs.length - 1
                        setIsDraggingToEnd(false)
                        setIsDraggingToStart(false)
                        if (dragOverTabIndex !== lastIndex) {
                          setDragOverTabIndex(lastIndex)
                        }
                      } else {
                        setIsDraggingToEnd(false)
                        setIsDraggingToStart(false)
                      }
                    }
                  }
                }
              }}
              onDrop={(e) => {
                e.preventDefault()
                // If dropped on the tab bar container (not on a specific tab),
                // check if we're at the end or start
                if (draggedTabIndex !== null && openTabs.length > 0) {
                  const x = e.clientX
                  const children = Array.from(e.currentTarget.children) as HTMLElement[]
                  
                  // Find the first tab element
                  let firstTabElement: HTMLElement | null = null
                  for (let i = 0; i < children.length; i++) {
                    if (children[i].classList.contains('tab-item') && !children[i].classList.contains('tab-placeholder')) {
                      firstTabElement = children[i]
                      break
                    }
                  }
                  
                  // Find the last tab element
                  let lastTabElement: HTMLElement | null = null
                  for (let i = children.length - 1; i >= 0; i--) {
                    if (children[i].classList.contains('tab-item') && !children[i].classList.contains('tab-placeholder')) {
                      lastTabElement = children[i]
                      break
                    }
                  }
                  
                  let targetIndex: number
                  if (firstTabElement && x < firstTabElement.getBoundingClientRect().left + 20) {
                    // Dropped before the first tab, insert at the start
                    targetIndex = 0
                    setIsDraggingToStart(false)
                  } else if (lastTabElement && x > lastTabElement.getBoundingClientRect().right - 20) {
                    // Dropped after the last tab, insert at the end
                    targetIndex = openTabs.length - 1
                    setIsDraggingToEnd(false)
                    setIsDraggingToStart(false)
                  } else {
                    // Use dragOverTabIndex if available, otherwise use last index
                    targetIndex = dragOverTabIndex !== null ? dragOverTabIndex : openTabs.length - 1
                    setIsDraggingToEnd(false)
                    setIsDraggingToStart(false)
                  }
                  
                  handleDrop(e, targetIndex)
                }
              }}
            >
              {(() => {
                // Check if dragging adjacent tabs (swap preview)
                const isAdjacentSwap = draggedTabIndex !== null && 
                  dragOverTabIndex !== null &&
                  Math.abs(draggedTabIndex - dragOverTabIndex) === 1
                
                // Create a preview array for rendering
                let displayTabs = [...openTabs]
                
                // If adjacent swap, swap positions in preview
                if (isAdjacentSwap && draggedTabIndex !== null && dragOverTabIndex !== null) {
                  const temp = displayTabs[draggedTabIndex]
                  displayTabs[draggedTabIndex] = displayTabs[dragOverTabIndex]
                  displayTabs[dragOverTabIndex] = temp
                }
                
                return displayTabs.map((tabId) => {
                  const originalIndex = openTabs.indexOf(tabId)
                const tabItem = navItems.find(item => item.id === tabId)
                let tabLabel: string
                if (tabItem) {
                  tabLabel = t(tabItem.label)
                } else if (tabId === 'three-sins') {
                  tabLabel = t('Three Sins')
                } else if (tabId === 'smile-recovery') {
                  tabLabel = t('Smile Recovery')
                } else {
                  tabLabel = tabId
                }
                const isActive = currentPage === tabId
                  const isDragging = draggedTabIndex === originalIndex
                  
                  // For non-adjacent: show placeholder at drop position
                  // Only show placeholder when we have a valid dragOverTabIndex
                  const isLastTab = originalIndex === openTabs.length - 1
                  const isFirstTab = originalIndex === 0
                  
                  // Show placeholder before target tab when dragging forward
                  const showPlaceholderBefore = !isAdjacentSwap && dragOverTabIndex !== null && 
                    draggedTabIndex !== null &&
                    draggedTabIndex < dragOverTabIndex &&
                    originalIndex === dragOverTabIndex &&
                    !(isLastTab && isDraggingToEnd) &&
                    !(isFirstTab && isDraggingToStart)
                  
                  // Show placeholder after target tab when dragging backward
                  // But exclude the case when dragging to the end (we'll show placeholderAtEnd instead)
                  const showPlaceholderAfter = !isAdjacentSwap && dragOverTabIndex !== null && 
                    draggedTabIndex !== null &&
                    draggedTabIndex > dragOverTabIndex &&
                    originalIndex === dragOverTabIndex &&
                    !(isLastTab && isDraggingToEnd) &&
                    !(isFirstTab && isDraggingToStart)
                  
                  // Special case: show placeholder after last tab when dragging to end
                  const showPlaceholderAtEnd = !isAdjacentSwap && 
                    dragOverTabIndex !== null &&
                    draggedTabIndex !== null &&
                    isLastTab &&
                    dragOverTabIndex === originalIndex &&
                    draggedTabIndex !== dragOverTabIndex &&
                    isDraggingToEnd
                  
                  // Special case: show placeholder before first tab when dragging to start
                  const showPlaceholderAtStart = !isAdjacentSwap && 
                    dragOverTabIndex !== null &&
                    draggedTabIndex !== null &&
                    isFirstTab &&
                    dragOverTabIndex === originalIndex &&
                    draggedTabIndex !== dragOverTabIndex &&
                    isDraggingToStart
                
                return (
                    <React.Fragment key={tabId}>
                      {(showPlaceholderBefore || showPlaceholderAtStart) && (
                        <div className="tab-placeholder" />
                      )}
                      <div
                        draggable
                        className={`tab-item ${isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''}`}
                        onClick={() => handleTabClick(tabId)}
                        onDragStart={(e) => handleDragStart(e, originalIndex)}
                        onDragOver={(e) => handleDragOver(e, originalIndex)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, originalIndex)}
                        onDragEnd={handleDragEnd}
                  >
                    <span className="tab-label">{tabLabel}</span>
                    <button
                      className="tab-close"
                      onClick={(e) => handleCloseTab(tabId, e)}
                          onMouseDown={(e) => e.stopPropagation()}
                          onDragStart={(e) => e.stopPropagation()}
                      aria-label="Close tab"
                    >
                      ×
                    </button>
                  </div>
                      {(showPlaceholderAfter || showPlaceholderAtEnd) && (
                        <div className="tab-placeholder" />
                      )}
                    </React.Fragment>
                )
                })
              })()}
            </div>
          )}

          {/* Editor Window */}
          <main className="editor-window">
            <div className="editor-content" ref={editorContentRef}>
              {(() => {
                const shouldSplitLines = ['interests', 'favorites', 'dreams'].includes(currentPage)
                
                if (!shouldSplitLines) {
                  return getPageContent().map((line, idx) => renderLine(line, idx + 1))
                }
                
                // Use split content if available, otherwise fallback to original
                const content = splitContent.length > 0 ? splitContent : getPageContent()
                return content.map((line, idx) => renderLine(line, idx + 1))
              })()}
            </div>
          </main>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-bar-content">
          <span className="status-bar-text">{t('Last Updated')}: {formatDate()}</span>
        </div>
      </div>
    </div>
  )
}

export default App
