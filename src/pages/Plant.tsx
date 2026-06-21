import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TreePine, Droplets, Sun, Sprout, Calendar, Check, PartyPopper, Flower2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGardenStore } from '@/store/gardenStore'

const getToday = () => new Date().toISOString().split('T')[0]
const getYesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d }

const formatDate = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`

const leafColor = (stability: number) => stability > 60 ? '#3A7D44' : stability > 30 ? '#8BC48D' : '#c29543'

function TreeSVG({ stage, stability }: { stage: number; stability: number }) {
  const color = leafColor(stability)
  const leafOpacity = 0.4 + (stability / 100) * 0.6

  return (
    <svg viewBox="0 0 200 260" className="w-48 h-60 mx-auto">
      <animateTransform attributeName="transform" type="rotate" values="-1 100 200;1 100 200;-1 100 200" dur="4s" repeatCount="indefinite" />
      {stage >= 0 && (
        <ellipse cx="100" cy="240" rx="30" ry="8" fill="#8B6914" opacity="0.3" />
      )}
      {stage === 0 && (
        <g>
          <ellipse cx="100" cy="235" rx="18" ry="6" fill="#8B6914" />
          <ellipse cx="100" cy="232" rx="8" ry="5" fill="#5daa60" opacity="0.7" />
        </g>
      )}
      {stage >= 1 && (
        <rect x="97" y={stage === 1 ? 200 : 140} width="6" height={stage === 1 ? 35 : 95} rx="3" fill="#6B4226" />
      )}
      {stage === 1 && (
        <g>
          <ellipse cx="100" cy="195" rx="16" ry="12" fill={color} opacity={leafOpacity} />
          <ellipse cx="88" cy="202" rx="10" ry="8" fill={color} opacity={leafOpacity * 0.8} />
          <ellipse cx="112" cy="202" rx="10" ry="8" fill={color} opacity={leafOpacity * 0.8} />
        </g>
      )}
      {stage >= 2 && (
        <g>
          <line x1="100" y1="170" x2="78" y2="145" stroke="#6B4226" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="155" x2="125" y2="130" stroke="#6B4226" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="180" x2="85" y2="165" stroke="#6B4226" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
      {stage === 2 && (
        <g>
          <ellipse cx="75" cy="140" rx="18" ry="14" fill={color} opacity={leafOpacity} />
          <ellipse cx="128" cy="125" rx="18" ry="14" fill={color} opacity={leafOpacity} />
          <ellipse cx="100" cy="130" rx="20" ry="16" fill={color} opacity={leafOpacity} />
          <ellipse cx="82" cy="160" rx="12" ry="10" fill={color} opacity={leafOpacity * 0.8} />
        </g>
      )}
      {stage >= 3 && (
        <g>
          <line x1="100" y1="190" x2="70" y2="175" stroke="#6B4226" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="175" x2="135" y2="155" stroke="#6B4226" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="68" cy="170" rx="22" ry="18" fill={color} opacity={leafOpacity} />
          <ellipse cx="138" cy="150" rx="22" ry="18" fill={color} opacity={leafOpacity} />
          <ellipse cx="75" cy="140" rx="24" ry="18" fill={color} opacity={leafOpacity} />
          <ellipse cx="128" cy="125" rx="24" ry="18" fill={color} opacity={leafOpacity} />
          <ellipse cx="100" cy="118" rx="30" ry="22" fill={color} opacity={leafOpacity} />
          <ellipse cx="85" cy="105" rx="22" ry="16" fill={color} opacity={leafOpacity * 0.9} />
          <ellipse cx="118" cy="108" rx="20" ry="15" fill={color} opacity={leafOpacity * 0.9} />
          <ellipse cx="100" cy="92" rx="18" ry="14" fill={color} opacity={leafOpacity * 0.8} />
          <ellipse cx="82" cy="160" rx="14" ry="12" fill={color} opacity={leafOpacity * 0.7} />
          <ellipse cx="122" cy="168" rx="14" ry="12" fill={color} opacity={leafOpacity * 0.7} />
        </g>
      )}
    </svg>
  )
}

function WaterDrops() {
  return (
    <>
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div key={i} className="absolute w-2 h-3 rounded-full bg-sky-400"
          initial={{ x: -10 + i * 8, y: -20, opacity: 1 }}
          animate={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.8, delay: i * 0.1, repeat: 1 }}
        />
      ))}
    </>
  )
}

function Sparkles() {
  return (
    <>
      {[0, 1, 2, 3].map(i => (
        <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-sprout-300"
          initial={{ scale: 0, x: (i - 1.5) * 15, y: -10 }}
          animate={{ scale: [0, 1.5, 0], y: -30 - i * 5 }}
          transition={{ duration: 0.6, delay: i * 0.12 }}
        />
      ))}
    </>
  )
}

function SunRays() {
  return (
    <motion.div className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0] }} transition={{ duration: 1.2 }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-b from-sunset-300/40 to-transparent rounded-full blur-xl" />
    </motion.div>
  )
}

function BloomFlower({ delay }: { delay: number }) {
  const colors = ['#F2B5C8', '#f8a863', '#8bc48d', '#fbcbdf']
  const c = colors[delay % colors.length]
  return (
    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay * 0.15, type: 'spring', stiffness: 200 }}>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 6} cy={Math.sin(a * Math.PI / 180) * 6} rx="4" ry="7" fill={c} opacity="0.9"
          transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r="3" fill="#F4D35E" />
    </motion.g>
  )
}

export default function Plant() {
  const { plantTree, waterTree, fertilizeTree, sunlightTree, addFlower, updateStreak, getTodayTree, completeFamilyTask, familyTasks } = useGardenStore()
  const today = getToday()
  const todayDate = new Date()
  const yesterdayDate = getYesterday()
  const tree = getTodayTree()
  const [effects, setEffects] = useState({ water: false, fertilize: false, sunlight: false })
  const [celebrating, setCelebrating] = useState(false)
  const [celebrated, setCelebrated] = useState(false)

  const allDone = tree?.actions.watered && tree?.actions.fertilized && tree?.actions.sunlight

  useEffect(() => {
    if (allDone && !celebrated) {
      setCelebrating(true)
      setCelebrated(true)
      addFlower({ type: 'bloom', x: 20 + Math.random() * 60, y: 20 + Math.random() * 60, color: '#F2B5C8', bloomDate: today })
      addFlower({ type: 'bloom', x: 20 + Math.random() * 60, y: 20 + Math.random() * 60, color: '#f8a863', bloomDate: today })
      updateStreak()
      const plantTask = familyTasks.find(t => t.taskType === 'plant' && !t.completed)
      if (plantTask) completeFamilyTask(plantTask.id)
    }
  }, [allDone, celebrated])

  const handleAction = (type: 'water' | 'fertilize' | 'sunlight') => {
    if (type === 'water') { waterTree(today); setEffects(e => ({ ...e, water: true })) }
    if (type === 'fertilize') { fertilizeTree(today); setEffects(e => ({ ...e, fertilize: true })) }
    if (type === 'sunlight') { sunlightTree(today); setEffects(e => ({ ...e, sunlight: true })) }
    setTimeout(() => setEffects({ water: false, fertilize: false, sunlight: false }), 1500)
  }

  const prompt = useMemo(() => {
    if (!tree) return ''
    const { watered, fertilized, sunlight } = tree.actions
    const done = [watered, fertilized, sunlight].filter(Boolean).length
    if (done === 0) return '今天是什么日子呢？'
    if (done === 1 && watered) return '做得好！还记得昨天做了什么吗？'
    if (done === 1 && fertilized) return '真棒！今天是几月几号？'
    if (done === 1 && sunlight) return '很好！昨天的天气怎么样？'
    if (done === 2) return '还差最后一步，小树就长大了！'
    return ''
  }, [tree])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-forest-50 font-body pb-8">
      <div className="px-4 pt-4">
        <Link to="/" className="text-forest-600 text-sm flex items-center gap-1 mb-3">← 返回花园</Link>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-6 h-6 text-forest-500" />
            <span className="font-display text-2xl text-forest-700">今天是 {formatDate(todayDate)}</span>
          </div>
          <span className="text-forest-400 text-sm">{todayDate.getFullYear()}年 星期{'日一二三四五六'[todayDate.getDay()]}</span>
        </motion.div>

        {!tree ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <TreePine className="w-24 h-24 text-forest-300" />
            </motion.div>
            <button onClick={() => plantTree(today)}
              className="mt-8 px-10 py-4 bg-forest-500 hover:bg-forest-600 text-white font-display text-xl rounded-garden shadow-garden transition-all active:scale-95">
              种下今天的树
            </button>
            <p className="text-soil-500 mt-3 text-sm">点击种下一棵属于今天的记忆之树</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative flex justify-center py-4">
              {effects.sunlight && <SunRays />}
              <div className="relative">
                <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="animate-sway">
                  <TreeSVG stage={tree.growthStage} stability={tree.memoryStability} />
                </motion.div>
                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                  {effects.water && <WaterDrops />}
                  {effects.fertilize && <Sparkles />}
                </div>
              </div>
            </div>

            {prompt && !allDone && (
              <motion.p key={prompt} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="text-center text-soil-600 font-body text-base mb-3">{prompt}</motion.p>
            )}

            <div className="flex justify-center gap-6 mb-4">
              {([
                { key: 'water' as const, icon: Droplets, label: '浇水', done: tree.actions.watered, color: 'bg-sky-400', activeColor: 'hover:bg-sky-500', prompt: `今天是${formatDate(todayDate)}` },
                { key: 'fertilize' as const, icon: Sprout, label: '施肥', done: tree.actions.fertilized, color: 'bg-sprout-300', activeColor: 'hover:bg-sprout-400', prompt: `昨天是${formatDate(yesterdayDate)}` },
                { key: 'sunlight' as const, icon: Sun, label: '阳光', done: tree.actions.sunlight, color: 'bg-sunset-400', activeColor: 'hover:bg-sunset-500', prompt: '让阳光温暖小树' },
              ]).map(item => (
                <div key={item.key} className="flex flex-col items-center gap-2">
                  <button onClick={() => !item.done && handleAction(item.key)} disabled={item.done}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-soft transition-all active:scale-90
                      ${item.done ? 'bg-forest-100 text-forest-500' : `${item.color} text-white ${item.activeColor}`}`}>
                    {item.done ? <Check className="w-7 h-7" /> : <item.icon className="w-7 h-7" />}
                  </button>
                  <span className="text-sm text-forest-700 font-display">{item.label}</span>
                  {item.done && <span className="text-xs text-forest-400">{item.prompt}</span>}
                </div>
              ))}
            </div>

            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-forest-50 text-forest-600 text-sm">
                <Flower2 className="w-4 h-4" />
                记忆稳定度: {tree.memoryStability}%
              </div>
            </div>

            <AnimatePresence>
              {celebrating && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-forest-900/30 flex items-center justify-center z-50" onClick={() => setCelebrating(false)}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
                    className="bg-white rounded-garden-lg p-8 shadow-garden-lg text-center mx-8">
                    <PartyPopper className="w-12 h-12 text-sunset-400 mx-auto mb-3" />
                    <h2 className="font-display text-2xl text-forest-700 mb-2">太棒了！</h2>
                    <p className="text-forest-500 font-body mb-4">今天的记忆之树已经长大！</p>
                    <svg viewBox="-30 -30 60 60" className="w-20 h-20 mx-auto mb-4">
                      {[0, 1, 2, 3].map(i => <BloomFlower key={i} delay={i} />)}
                    </svg>
                    <button onClick={() => setCelebrating(false)}
                      className="px-8 py-3 bg-forest-500 text-white font-display text-lg rounded-garden shadow-garden">
                      继续守护
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
