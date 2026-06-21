import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TreeRecord {
  id: string
  date: string
  growthStage: number
  memoryStability: number
  actions: {
    watered: boolean
    fertilized: boolean
    sunlight: boolean
  }
}

export interface FaceRecord {
  id: string
  photoUrl: string
  name: string
  relation: string
  difficulty: number
  successCount: number
  lastPracticed: string
}

export interface RouteNode {
  id: string
  name: string
  description: string
  x: number
  y: number
  icon: string
}

export interface RouteProgress {
  id: string
  routeName: string
  nodes: RouteNode[]
  currentNodeIndex: number
  lastWalked: string
}

export interface FamilyTask {
  id: string
  familyMemberName: string
  taskType: 'plant' | 'face' | 'route'
  message: string
  completed: boolean
  createdAt: string
}

export interface Flower {
  type: string
  x: number
  y: number
  color: string
  bloomDate: string
}

type FontSize = 'normal' | 'large' | 'xlarge'

interface GardenStore {
  userName: string
  fontSize: FontSize
  highContrast: boolean
  trees: TreeRecord[]
  faces: FaceRecord[]
  routeProgress: RouteProgress[]
  familyTasks: FamilyTask[]
  flowers: Flower[]
  streakDays: number
  lastActiveDate: string

  setUserName: (name: string) => void
  setFontSize: (size: FontSize) => void
  setHighContrast: (enabled: boolean) => void
  plantTree: (date: string) => void
  waterTree: (date: string) => void
  fertilizeTree: (date: string) => void
  sunlightTree: (date: string) => void
  addFace: (face: FaceRecord) => void
  updateFace: (id: string, updates: Partial<FaceRecord>) => void
  removeFace: (id: string) => void
  addFamilyTask: (task: FamilyTask) => void
  completeFamilyTask: (id: string) => void
  addFlower: (flower: Flower) => void
  advanceRoute: (routeId: string) => void
  updateStreak: () => void
  getTodayTree: () => TreeRecord | undefined
}

const today = () => new Date().toISOString().split('T')[0]

const defaultRouteNodes: RouteNode[] = [
  { id: 'home', name: '家', description: '温馨的家', x: 10, y: 80, icon: 'home' },
  { id: 'intersection1', name: '第一个路口', description: '拐角处有大树', x: 30, y: 65, icon: 'crosshair' },
  { id: 'market', name: '菜市场', description: '每天买菜的地方', x: 55, y: 45, icon: 'shopping-basket' },
  { id: 'intersection2', name: '公园路口', description: '看到公园大门', x: 75, y: 30, icon: 'crosshair' },
  { id: 'park', name: '公园', description: '散步休息的好去处', x: 90, y: 15, icon: 'trees' },
]

const defaultFaces: FaceRecord[] = [
  { id: '1', photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kind%20elderly%20chinese%20woman%20smiling%20warmly%20portrait%20photo&image_size=square', name: '王秀兰', relation: '老伴', difficulty: 1, successCount: 0, lastPracticed: '' },
  { id: '2', photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20man%20professional%20portrait%20smiling&image_size=square', name: '李明', relation: '儿子', difficulty: 1, successCount: 0, lastPracticed: '' },
  { id: '3', photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20chinese%20woman%20gentle%20smile%20portrait&image_size=square', name: '李娟', relation: '女儿', difficulty: 2, successCount: 0, lastPracticed: '' },
  { id: '4', photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20chinese%20little%20girl%20happy%20smile%20portrait&image_size=square', name: '朵朵', relation: '孙女', difficulty: 2, successCount: 0, lastPracticed: '' },
  { id: '5', photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20elderly%20chinese%20man%20portrait%20smiling&image_size=square', name: '老张', relation: '邻居', difficulty: 3, successCount: 0, lastPracticed: '' },
  { id: '6', photoUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20chinese%20woman%20vendor%20portrait&image_size=square', name: '陈阿姨', relation: '菜场摊主', difficulty: 3, successCount: 0, lastPracticed: '' },
]

export const useGardenStore = create<GardenStore>()(
  persist(
    (set, get) => ({
      userName: '李爷爷',
      fontSize: 'large' as FontSize,
      highContrast: false,
      trees: [],
      faces: defaultFaces,
      routeProgress: [
        {
          id: 'daily-walk',
          routeName: '每日散步路线',
          nodes: defaultRouteNodes,
          currentNodeIndex: 0,
          lastWalked: '',
        },
      ],
      familyTasks: [
        { id: 't1', familyMemberName: '李明', taskType: 'plant', message: '爸，今天记得给小树浇水哦！', completed: false, createdAt: today() },
        { id: 't2', familyMemberName: '李娟', taskType: 'face', message: '爸，来认认家人的照片吧 💕', completed: false, createdAt: today() },
        { id: 't3', familyMemberName: '李明', taskType: 'route', message: '爸，走一走散步路线吧！', completed: false, createdAt: today() },
      ],
      flowers: [],
      streakDays: 0,
      lastActiveDate: '',

      setUserName: (name) => set({ userName: name }),

      setFontSize: (size) => set({ fontSize: size }),

      setHighContrast: (enabled) => set({ highContrast: enabled }),

      plantTree: (date) => {
        const existing = get().trees.find((t) => t.date === date)
        if (existing) return
        set((state) => ({
          trees: [
            ...state.trees,
            {
              id: `tree-${date}`,
              date,
              growthStage: 0,
              memoryStability: 50,
              actions: { watered: false, fertilized: false, sunlight: false },
            },
          ],
        }))
      },

      waterTree: (date) =>
        set((state) => ({
          trees: state.trees.map((t) =>
            t.date === date ? { ...t, actions: { ...t.actions, watered: true }, growthStage: Math.min(t.growthStage + 1, 3), memoryStability: Math.min(t.memoryStability + 15, 100) } : t
          ),
        })),

      fertilizeTree: (date) =>
        set((state) => ({
          trees: state.trees.map((t) =>
            t.date === date ? { ...t, actions: { ...t.actions, fertilized: true }, growthStage: Math.min(t.growthStage + 1, 3), memoryStability: Math.min(t.memoryStability + 15, 100) } : t
          ),
        })),

      sunlightTree: (date) =>
        set((state) => ({
          trees: state.trees.map((t) =>
            t.date === date ? { ...t, actions: { ...t.actions, sunlight: true }, growthStage: Math.min(t.growthStage + 1, 3), memoryStability: Math.min(t.memoryStability + 10, 100) } : t
          ),
        })),

      addFace: (face) => set((state) => ({ faces: [...state.faces, face] })),

      updateFace: (id, updates) =>
        set((state) => ({
          faces: state.faces.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),

      removeFace: (id) => set((state) => ({ faces: state.faces.filter((f) => f.id !== id) })),

      addFamilyTask: (task) => set((state) => ({ familyTasks: [...state.familyTasks, task] })),

      completeFamilyTask: (id) =>
        set((state) => ({
          familyTasks: state.familyTasks.map((t) => (t.id === id ? { ...t, completed: true } : t)),
        })),

      addFlower: (flower) => set((state) => ({ flowers: [...state.flowers, flower] })),

      advanceRoute: (routeId) =>
        set((state) => ({
          routeProgress: state.routeProgress.map((r) =>
            r.id === routeId
              ? { ...r, currentNodeIndex: Math.min(r.currentNodeIndex + 1, r.nodes.length - 1), lastWalked: today() }
              : r
          ),
        })),

      updateStreak: () => {
        const state = get()
        const todayStr = today()
        if (state.lastActiveDate === todayStr) return
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]
        const newStreak = state.lastActiveDate === yesterdayStr ? state.streakDays + 1 : 1
        set({ streakDays: newStreak, lastActiveDate: todayStr })
      },

      getTodayTree: () => {
        return get().trees.find((t) => t.date === today())
      },
    }),
    {
      name: 'memory-garden-store',
    }
  )
)
