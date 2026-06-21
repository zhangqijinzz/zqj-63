import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, ShoppingBasket, Trees, MapPin, Navigation, ArrowRight, Check, RotateCcw, Flag, Flower2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGardenStore } from '@/store/gardenStore'

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="w-4 h-4" />,
  'shopping-basket': <ShoppingBasket className="w-4 h-4" />,
  trees: <Trees className="w-4 h-4" />,
  crosshair: <MapPin className="w-4 h-4" />,
}

const questions = [
  { q: '这是哪里？您来这里做什么？', correct: '这是我的家', wrong: '这是菜市场' },
  { q: '这棵大树在哪个路口？', correct: '第一个路口', wrong: '公园路口' },
  { q: '这里可以买到什么？', correct: '新鲜的蔬菜', wrong: '衣服和鞋' },
  { q: '从这里可以看到什么？', correct: '公园大门', wrong: '学校大门' },
  { q: '来这里做什么最好？', correct: '散步休息', wrong: '上班开会' },
]

const DecorativeElements = () => (
  <>
    <rect x="22" y="72" width="4" height="6" rx="1" fill="#5daa60" opacity="0.4" />
    <circle cx="24" cy="70" r="3" fill="#8bc48d" opacity="0.4" />
    <rect x="42" y="56" width="3" height="5" rx="1" fill="#5daa60" opacity="0.35" />
    <circle cx="43.5" cy="54" r="2.5" fill="#8bc48d" opacity="0.35" />
    <rect x="65" y="38" width="4" height="6" rx="1" fill="#5daa60" opacity="0.4" />
    <circle cx="67" cy="36" r="3" fill="#8bc48d" opacity="0.4" />
    <rect x="82" y="22" width="3" height="5" rx="1" fill="#5daa60" opacity="0.35" />
    <circle cx="83.5" cy="20" r="2.5" fill="#8bc48d" opacity="0.35" />
    <rect x="15" y="58" width="5" height="4" rx="0.5" fill="#d1af6c" opacity="0.3" />
    <polygon points="17.5,52 14,58 21,58" fill="#c29543" opacity="0.3" />
    <rect x="48" y="34" width="5" height="4" rx="0.5" fill="#d1af6c" opacity="0.3" />
    <polygon points="50.5,28 47,34 54,34" fill="#c29543" opacity="0.3" />
    <ellipse cx="35" cy="85" rx="6" ry="2" fill="#b9ddb9" opacity="0.3" />
    <ellipse cx="60" cy="75" rx="5" ry="1.5" fill="#b9ddb9" opacity="0.25" />
    <ellipse cx="80" cy="55" rx="4" ry="1.5" fill="#b9ddb9" opacity="0.25" />
  </>
)

export default function Route() {
  const { routeProgress, advanceRoute, addFlower, completeFamilyTask, familyTasks, updateStreak } = useGardenStore()
  const route = routeProgress[0]
  const [isWalking, setIsWalking] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const currentIdx = route?.currentNodeIndex ?? 0
  const nodes = route?.nodes ?? []
  const currentNode = nodes[currentIdx]
  const isLastNode = currentIdx >= nodes.length - 1

  const pathD = nodes
    .map((n, i) => (i === 0 ? `M ${n.x} ${n.y}` : `Q ${(nodes[i - 1].x + n.x) / 2} ${nodes[i - 1].y} ${n.x} ${n.y}`))
    .join(' ')

  const handleAnswer = useCallback(
    (answer: string) => {
      if (isWalking) return
      const correct = questions[currentIdx]?.correct
      setSelectedAnswer(answer)
      if (answer === correct) {
        setIsWalking(true)
        setTimeout(() => {
          if (isLastNode) {
            advanceRoute(route.id)
            addFlower({ type: 'route-flower', x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, color: '#F2B5C8', bloomDate: new Date().toISOString().split('T')[0] })
            addFlower({ type: 'route-flower', x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, color: '#8bc48d', bloomDate: new Date().toISOString().split('T')[0] })
            addFlower({ type: 'route-flower', x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, color: '#E8913A', bloomDate: new Date().toISOString().split('T')[0] })
            const routeTask = familyTasks.find((t) => t.taskType === 'route' && !t.completed)
            if (routeTask) completeFamilyTask(routeTask.id)
            updateStreak()
            setCompleted(true)
            setShowCelebration(true)
          } else {
            addFlower({ type: 'route-flower', x: currentNode.x, y: currentNode.y - 5, color: '#8bc48d', bloomDate: new Date().toISOString().split('T')[0] })
            advanceRoute(route.id)
          }
          setIsWalking(false)
          setSelectedAnswer(null)
        }, 1200)
      } else {
        setTimeout(() => setSelectedAnswer(null), 1000)
      }
    },
    [currentIdx, isWalking, isLastNode, route, currentNode, advanceRoute, addFlower, completeFamilyTask, familyTasks, updateStreak]
  )

  const handleReset = useCallback(() => {
    const store = useGardenStore.getState()
    const updated = store.routeProgress.map((r) => (r.id === route.id ? { ...r, currentNodeIndex: 0 } : r))
    useGardenStore.setState({ routeProgress: updated })
    setCompleted(false)
    setShowCelebration(false)
  }, [route])

  if (!route || !currentNode) return null

  return (
    <div className="min-h-screen bg-forest-50 font-body px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="text-forest-600 text-sm flex items-center gap-1">
          <Navigation className="w-4 h-4" /> 返回
        </Link>
        <h1 className="font-display text-xl text-forest-800 flex items-center gap-2">
          <Flag className="w-5 h-5 text-sunset-400" /> 路线回放
        </h1>
        <button onClick={handleReset} className="text-soil-500 flex items-center gap-1 text-sm">
          <RotateCcw className="w-4 h-4" /> 重走
        </button>
      </div>

      <div className="bg-white rounded-garden-lg shadow-garden p-3 mb-4">
        <svg viewBox="0 0 100 100" className="w-full">
          <rect x="0" y="0" width="100" height="100" rx="8" fill="#f0f7f1" />
          <DecorativeElements />
          <path d={pathD} fill="none" stroke="#8B6914" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.5" />
          {nodes.map((node, i) => {
            const visited = i < currentIdx
            const isCurrent = i === currentIdx
            return (
              <g key={node.id}>
                {visited && (
                  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <circle cx={node.x} cy={node.y - 4} r="2" fill="#F2B5C8" opacity="0.7" />
                    <line x1={node.x} y1={node.y - 2.5} x2={node.x} y2={node.y - 1} stroke="#5daa60" strokeWidth="0.5" />
                  </motion.g>
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isCurrent ? 5 : 4}
                  fill={visited ? '#5daa60' : isCurrent ? '#3A7D44' : '#d1af6c'}
                  opacity={visited || isCurrent ? 1 : 0.5}
                  stroke={isCurrent ? '#E8913A' : 'none'}
                  strokeWidth={isCurrent ? 1.5 : 0}
                />
                {isCurrent && (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="7"
                    fill="none"
                    stroke="#3A7D44"
                    strokeWidth="0.8"
                    animate={{ r: [5, 9, 5], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <g transform={`translate(${node.x}, ${node.y})`}>
                  <g transform="translate(-2, -2)">{iconMap[node.icon]}</g>
                </g>
                <text x={node.x} y={node.y + 8} textAnchor="middle" fontSize="3.5" fill="#1e3f23" fontFamily="'Noto Sans SC', sans-serif">
                  {node.name}
                </text>
              </g>
            )
          })}
          {!completed && (
            <motion.circle
              cx={currentNode.x}
              cy={currentNode.y}
              r="2"
              fill="#E8913A"
              animate={{ cx: isWalking ? nodes[Math.min(currentIdx + 1, nodes.length - 1)].x : currentNode.x, cy: isWalking ? nodes[Math.min(currentIdx + 1, nodes.length - 1)].y : currentNode.y }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          )}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key={currentNode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-garden-lg shadow-warm p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-sunset-400" />
              <h2 className="font-display text-lg text-forest-800">{currentNode.name}</h2>
            </div>
            <p className="text-soil-700 text-sm mb-4">{currentNode.description}</p>
            <p className="text-forest-700 font-medium mb-3">{questions[currentIdx]?.q}</p>
            <div className="flex flex-col gap-3">
              {[questions[currentIdx]?.correct, questions[currentIdx]?.wrong].map((ans) => (
                <motion.button
                  key={ans}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAnswer(ans)}
                  disabled={isWalking}
                  className={`w-full py-3 px-4 rounded-garden text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    selectedAnswer === ans
                      ? ans === questions[currentIdx]?.correct
                        ? 'bg-forest-500 text-white'
                        : 'bg-red-100 text-red-600'
                      : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
                  }`}
                >
                  {selectedAnswer === ans && ans === questions[currentIdx]?.correct && <Check className="w-4 h-4" />}
                  {ans}
                  {ans === questions[currentIdx]?.correct && !selectedAnswer && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-garden-lg shadow-garden-lg p-6 text-center relative overflow-hidden"
          >
            {showCelebration && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{ opacity: [0, 1, 0], y: -60 - i * 15, x: (i % 2 === 0 ? 1 : -1) * (20 + i * 8) }}
                    transition={{ duration: 1.5 + i * 0.2, repeat: Infinity, repeatDelay: 0.5 }}
                    className="absolute"
                    style={{ left: `${40 + i * 5}%`, top: '60%' }}
                  >
                    <Flower2 className="w-5 h-5" style={{ color: ['#F2B5C8', '#8bc48d', '#E8913A', '#F4D35E'][i % 4] }} />
                  </motion.div>
                ))}
              </div>
            )}
            <motion.div animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ duration: 0.5 }}>
              <Flower2 className="w-12 h-12 text-sunset-400 mx-auto mb-3" />
            </motion.div>
            <h2 className="font-display text-2xl text-forest-800 mb-2">路线完成！</h2>
            <p className="text-soil-600 text-sm mb-5">太棒了，您成功走完了全程 🎉</p>
            <button
              onClick={handleReset}
              className="bg-forest-500 text-white py-3 px-6 rounded-garden font-medium flex items-center gap-2 mx-auto hover:bg-forest-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> 再走一次
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
