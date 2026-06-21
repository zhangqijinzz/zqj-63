import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TreePine, Droplets, Sun, Heart, Map, Users, Flower2, Calendar, Flame, Check, ChevronRight } from 'lucide-react'
import { useGardenStore } from '@/store/gardenStore'

const TASK_CFG: Record<string, { icon: typeof TreePine; path: string; bg: string; ic: string }> = {
  plant: { icon: TreePine, path: '/plant', bg: 'bg-forest-100', ic: 'text-forest-500' },
  face: { icon: Users, path: '/faces', bg: 'bg-sunset-100', ic: 'text-sunset-500' },
  route: { icon: Map, path: '/route', bg: 'bg-sky-100', ic: 'text-sky-500' },
}

const treeFill = (s: number) => (s > 60 ? '#3A7D44' : s > 30 ? '#a8c256' : '#8B6914')

function MiniTree({ memoryStability, growthStage }: { memoryStability: number; growthStage: number }) {
  const fill = treeFill(memoryStability)
  const r = 7 + growthStage * 3
  return (
    <svg viewBox="0 0 40 50" className="w-full h-full">
      <rect x="17" y="32" width="6" height="14" rx="2" fill="#8B6914" opacity="0.8" />
      <circle cx="20" cy={32 - r / 2} r={r} fill={fill} />
      <circle cx="16" cy={36 - r / 2} r={r * 0.7} fill={fill} opacity="0.85" />
      <circle cx="24" cy={36 - r / 2} r={r * 0.7} fill={fill} opacity="0.85" />
    </svg>
  )
}

export default function Home() {
  const { userName, trees, flowers, familyTasks, streakDays } = useGardenStore()
  const incompleteTasks = familyTasks.filter(t => !t.completed)
  const now = new Date()
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
  const hour = now.getHours()
  const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'

  const last14 = useMemo(() =>
    Array.from({ length: 14 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - 13 + i)
      const ds = d.toISOString().split('T')[0]
      return { date: ds, label: `${d.getDate()}日`, tree: trees.find(t => t.date === ds) }
    }), [trees])

  const cv = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
  const iv = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-forest-50 to-soil-50 font-body pb-8">
      <div className="relative overflow-hidden rounded-b-garden-lg">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice">
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F4D35E" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F4D35E" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A7D44" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3A7D44" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A7D44" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3A7D44" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <circle cx="340" cy="45" r="45" fill="url(#sunGlow)" />
          <circle cx="340" cy="45" r="22" fill="#F4D35E" />
          <ellipse cx="90" cy="50" rx="45" ry="14" fill="white" opacity="0.7" />
          <ellipse cx="115" cy="44" rx="32" ry="11" fill="white" opacity="0.6" />
          <ellipse cx="230" cy="38" rx="38" ry="13" fill="white" opacity="0.5" />
          <path d="M0 155 Q60 130 130 148 Q220 170 310 142 Q360 128 400 138 L400 220 L0 220Z" fill="url(#hillFar)" />
          <path d="M0 175 Q80 155 170 168 Q270 183 360 158 L400 165 L400 220 L0 220Z" fill="#3A7D44" opacity="0.3" />
          <path d="M0 192 Q100 180 200 188 Q310 198 400 182 L400 220 L0 220Z" fill="url(#hillNear)" />
        </svg>
        <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-4 left-4 opacity-60">
          <TreePine className="w-8 h-8 text-forest-600" />
        </motion.div>
        <motion.div animate={{ y: [2, -2, 2] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-6 right-24 opacity-60">
          <Flower2 className="w-7 h-7 text-petal-400" />
        </motion.div>
        <motion.div animate={{ y: [-2, 2, -2] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 right-8 opacity-50">
          <Droplets className="w-6 h-6 text-sky-400" />
        </motion.div>
        <div className="relative z-10 px-6 pt-10 pb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="w-5 h-5 text-sprout-300" />
            <span className="text-sm text-forest-700">{dateStr}</span>
          </div>
          <h1 className="font-display text-3xl text-forest-800 mb-1">{userName}，{greeting} 🌿</h1>
          <p className="text-forest-600 text-base">今天也想在花园里走走吗？</p>
        </div>
      </div>

      <section className="px-4 mt-6">
        <h2 className="font-display text-xl text-forest-800 mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-sunset-400" />今天的任务
        </h2>
        <motion.div variants={cv} initial="hidden" animate="show" className="space-y-3">
          {incompleteTasks.map(task => {
            const cfg = TASK_CFG[task.taskType]
            const Icon = cfg.icon
            return (
              <motion.div key={task.id} variants={iv}>
                <Link to={cfg.path} className="flex items-center gap-4 p-4 bg-white rounded-garden shadow-garden hover:shadow-garden-lg transition-all min-h-[64px] active:scale-[0.98]">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cfg.bg}`}>
                    <Icon className={`w-6 h-6 ${cfg.ic}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg text-forest-800">{task.familyMemberName}</p>
                    <p className="text-forest-600 text-sm truncate">{task.message}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-forest-300 flex-shrink-0" />
                </Link>
              </motion.div>
            )
          })}
          {incompleteTasks.length === 0 && (
            <div className="text-center py-8 text-forest-400">
              <Check className="w-10 h-10 mx-auto mb-2" />
              <p className="font-display text-lg">今天任务都完成啦！</p>
            </div>
          )}
        </motion.div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl text-forest-800 mb-3 px-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-forest-500" />记忆森林
        </h2>
        <div className="flex gap-2 px-4 overflow-x-auto pb-3">
          {last14.map(({ date, label, tree }, i) => (
            <motion.div key={date} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }} className="flex-shrink-0 w-14 flex flex-col items-center gap-1">
              <div className="w-12 h-16 flex items-end justify-center">
                {tree ? (
                  <motion.div className="w-10 h-14" animate={{ rotate: [-1, 1, -1] }}
                    transition={{ duration: 2.5 + i * 0.15, repeat: Infinity, ease: 'easeInOut' }}>
                    <MiniTree memoryStability={tree.memoryStability} growthStage={tree.growthStage} />
                  </motion.div>
                ) : (
                  <div className="w-3 h-3 rounded-full bg-soil-200 mb-2" />
                )}
              </div>
              <span className="text-xs text-forest-500">{label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 mt-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { Icon: Flame, label: '连续天数', value: streakDays, bg: 'bg-sunset-50', color: 'text-sunset-400' },
            { Icon: Flower2, label: '花朵数', value: flowers.length, bg: 'bg-petal-50', color: 'text-petal-400' },
            { Icon: TreePine, label: '树木数', value: trees.length, bg: 'bg-forest-50', color: 'text-forest-400' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className={`${s.bg} rounded-garden shadow-soft p-3 text-center`}>
              <s.Icon className={`w-6 h-6 mx-auto mb-1 ${s.color}`} />
              <p className="font-display text-2xl text-forest-800">{s.value}</p>
              <p className="text-xs text-forest-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {flowers.length > 0 && (
        <section className="mt-8 mx-4 bg-gradient-to-br from-forest-50 to-petal-50 rounded-garden-lg p-4">
          <h2 className="font-display text-xl text-forest-800 mb-3 flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-petal-400" />花园小花
          </h2>
          <div className="relative h-28 bg-gradient-to-t from-forest-100/40 to-transparent rounded-garden overflow-hidden">
            {flowers.map((f, i) => (
              <motion.div key={i} className="absolute"
                style={{ left: `${Math.min(f.x, 90)}%`, top: `${Math.min(f.y, 70)}%` }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}>
                <motion.div animate={{ rotate: [-5, 5, -5], y: [-2, 2, -2] }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}>
                  <svg viewBox="0 0 30 30" className="w-8 h-8">
                    <circle cx="15" cy="10" r="6" fill={f.color} opacity="0.75" />
                    <circle cx="10" cy="14" r="5" fill={f.color} opacity="0.65" />
                    <circle cx="20" cy="14" r="5" fill={f.color} opacity="0.65" />
                    <circle cx="15" cy="13" r="3" fill="#F4D35E" />
                    <line x1="15" y1="16" x2="15" y2="28" stroke="#3A7D44" strokeWidth="2" />
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
