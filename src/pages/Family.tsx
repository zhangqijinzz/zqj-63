import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, TreePine, Users, Map, Send, Flower2, MessageCircle, Check, Plus, BarChart3, Flame } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGardenStore } from '@/store/gardenStore'

const taskIcons = { plant: TreePine, face: Users, route: Map }
const taskLabels = { plant: '种树', face: '认面孔', route: '走路线' }
const taskColors = { plant: 'text-forest-500', face: 'text-petal-500', route: 'text-sunset-500' }
const flowerColors = ['#F2B5C8', '#E8913A', '#3A7D44', '#87CEEB', '#F4D35E', '#d2638e']

function SyncFlower({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      initial={{ x: -40, opacity: 0, scale: 0 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, type: 'spring' }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" fill={color} opacity={0.9} />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <circle
            key={angle}
            cx={12 + 6 * Math.cos((angle * Math.PI) / 180)}
            cy={12 + 6 * Math.sin((angle * Math.PI) / 180)}
            r="3.5"
            fill={color}
            opacity={0.7}
          />
        ))}
      </svg>
    </motion.div>
  )
}

function MiniGarden({ label, flowerCount }: { label: string; flowerCount: number }) {
  return (
    <div className="flex-1 bg-forest-50/50 rounded-garden p-3 text-center">
      <p className="font-body text-xs text-forest-700 mb-2">{label}</p>
      <div className="h-20 flex flex-wrap gap-1 justify-center items-center content-center">
        {Array.from({ length: Math.min(flowerCount, 8) }).map((_, i) => (
          <SyncFlower key={i} color={flowerColors[i % flowerColors.length]} delay={i * 0.08} />
        ))}
        {flowerCount === 0 && <p className="text-forest-300 text-xs font-body">暂无花朵</p>}
      </div>
    </div>
  )
}

export default function Family() {
  const { familyTasks, addFamilyTask, completeFamilyTask, flowers, trees, faces, streakDays, userName } = useGardenStore()
  const [taskType, setTaskType] = useState<'plant' | 'face' | 'route'>('plant')
  const [message, setMessage] = useState('')
  const [flyingFlower, setFlyingFlower] = useState(false)

  const completedCount = familyTasks.filter((t) => t.completed).length
  const syncedFlowers = flowers.length
  const dailyData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const ds = d.toISOString().split('T')[0]
    const dayTasks = familyTasks.filter((t) => t.createdAt === ds && t.completed).length
    const dayFlowers = flowers.filter((f) => f.bloomDate === ds).length
    const dayTrees = trees.filter((t) => t.date === ds).length
    return { day: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()], value: dayTasks + dayFlowers + dayTrees }
  })
  const maxDaily = Math.max(...dailyData.map((d) => d.value), 1)
  const faceSuccessTotal = faces.reduce((sum, f) => sum + f.successCount, 0)

  const handleAddTask = () => {
    if (!message.trim()) return
    addFamilyTask({
      id: `ft-${Date.now()}`,
      familyMemberName: userName,
      taskType,
      message: message.trim(),
      completed: false,
      createdAt: new Date().toISOString().split('T')[0],
    })
    setMessage('')
  }

  const handleComplete = (id: string) => {
    setFlyingFlower(true)
    completeFamilyTask(id)
    setTimeout(() => setFlyingFlower(false), 1200)
  }

  const encouragementMessages = familyTasks.filter((t) => t.message && !t.completed)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sunset-50 to-forest-50 pb-8">
      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <h1 className="font-display text-2xl text-forest-700">家人协作中心</h1>
          <Link to="/" className="text-forest-500 font-body text-sm flex items-center gap-1">
            <Heart size={14} /> 返回花园
          </Link>
        </motion.div>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-garden-lg shadow-garden p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flower2 size={18} className="text-petal-400" />
            <h2 className="font-display text-lg text-forest-700">花园同步</h2>
          </div>
          <div className="flex gap-3 items-center">
            <MiniGarden label="长辈的花园" flowerCount={syncedFlowers} />
            <div className="flex flex-col items-center gap-1">
              <AnimatePresence>
                {flyingFlower && (
                  <motion.div
                    initial={{ x: -30, opacity: 1, scale: 1.5 }}
                    animate={{ x: 30, opacity: 0.5, scale: 0.8 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <Flower2 size={20} className="text-petal-400" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="w-8 h-px bg-forest-300" />
              <span className="text-xs font-body text-forest-600">{syncedFlowers}朵</span>
            </div>
            <MiniGarden label="家人的花园" flowerCount={completedCount} />
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-garden-lg shadow-garden p-4">
          <div className="flex items-center gap-2 mb-3">
            <Check size={18} className="text-forest-500" />
            <h2 className="font-display text-lg text-forest-700">今日任务</h2>
          </div>
          <div className="space-y-2">
            {familyTasks.map((task, i) => {
              const Icon = taskIcons[task.taskType]
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => !task.completed && handleComplete(task.id)}
                  className={`flex items-center gap-3 p-3 rounded-garden transition-colors ${task.completed ? 'bg-forest-50/60' : 'bg-sunset-50/40 cursor-pointer active:scale-[0.98]'}`}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-body text-sm font-bold shrink-0"
                    style={{ backgroundColor: task.familyMemberName === '李明' ? '#3A7D44' : task.familyMemberName === '李娟' ? '#E8913A' : '#F2B5C8' }}>
                    {task.familyMemberName[0]}
                  </div>
                  <Icon size={18} className={taskColors[task.taskType]} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-body text-sm ${task.completed ? 'text-forest-400 line-through' : 'text-forest-700'}`}>{task.message}</p>
                    <p className="font-body text-xs text-forest-400">{task.familyMemberName} · {taskLabels[task.taskType]}</p>
                  </div>
                  {task.completed ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </motion.div>
                  ) : (
                    <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-7 h-7 rounded-full border-2 border-sunset-400" />
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-garden-lg shadow-garden p-4">
          <div className="flex items-center gap-2 mb-3">
            <Plus size={18} className="text-sunset-400" />
            <h2 className="font-display text-lg text-forest-700">发送新任务</h2>
          </div>
          <div className="flex gap-2 mb-3">
            {(['plant', 'face', 'route'] as const).map((type) => {
              const Icon = taskIcons[type]
              return (
                <button key={type} onClick={() => setTaskType(type)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-garden transition-all ${taskType === type ? 'bg-forest-500 text-white shadow-garden' : 'bg-forest-50 text-forest-600'}`}>
                  <Icon size={22} />
                  <span className="font-body text-xs">{taskLabels[type]}</span>
                </button>
              )
            })}
          </div>
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="写一句鼓励的话..."
              className="flex-1 px-4 py-3 rounded-garden bg-sunset-50 font-body text-sm text-forest-700 placeholder:text-forest-300 outline-none focus:ring-2 focus:ring-forest-300"
            />
            <button onClick={handleAddTask}
              className="px-4 py-3 bg-sunset-400 text-white rounded-garden font-body text-sm flex items-center gap-1 active:scale-95 transition-transform">
              <Send size={16} /> 发送
            </button>
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-garden-lg shadow-garden p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={18} className="text-forest-500" />
            <h2 className="font-display text-lg text-forest-700">训练报告</h2>
          </div>
          <div className="flex items-end justify-between gap-1 h-28 mb-2 px-1">
            {dailyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxDaily) * 80}%` }}
                  transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                  className="w-full min-h-[4px] rounded-t-sm bg-gradient-to-t from-forest-500 to-forest-300"
                />
                <span className="font-body text-[10px] text-forest-400">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '连续天数', value: streakDays, icon: Flame, color: 'text-sunset-400' },
              { label: '总花朵数', value: flowers.length, icon: Flower2, color: 'text-petal-400' },
              { label: '总树木数', value: trees.length, icon: TreePine, color: 'text-forest-500' },
              { label: '面孔识别', value: faceSuccessTotal, icon: Users, color: 'text-sunset-500' },
            ].map((s) => (
              <div key={s.label} className="bg-forest-50 rounded-garden p-2 text-center">
                <s.icon size={16} className={`${s.color} mx-auto mb-1`} />
                <p className="font-display text-lg text-forest-700">{s.value}</p>
                <p className="font-body text-[10px] text-forest-400">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-garden-lg shadow-warm p-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle size={18} className="text-petal-400" />
            <h2 className="font-display text-lg text-forest-700">家人寄语</h2>
          </div>
          <div className="space-y-2">
            {encouragementMessages.length === 0 && (
              <p className="font-body text-sm text-forest-300 text-center py-4">完成更多任务，收获更多温暖</p>
            )}
            {encouragementMessages.map((task, i) => (
              <motion.div key={task.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="relative bg-gradient-to-r from-sunset-50 to-petal-50 rounded-garden p-3">
                <div className="absolute -left-1 top-3 w-2 h-2 bg-sunset-200 rotate-45" />
                <p className="font-body text-sm text-forest-700 mb-1">{task.message}</p>
                <p className="font-body text-xs text-sunset-400">—— {task.familyMemberName}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
