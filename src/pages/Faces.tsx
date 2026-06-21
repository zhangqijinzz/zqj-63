import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Heart, Flower2, Sparkles, ArrowLeft, Check, ChevronRight, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGardenStore } from '@/store/gardenStore'

const featureHints: Record<string, string> = {
  '老伴': '慈祥的笑容',
  '儿子': '帅气的模样',
  '女儿': '温柔的眼神',
  '孙女': '可爱的小脸蛋',
  '邻居': '亲切的面容',
  '菜场摊主': '热情的样子',
}

const encouragements = ['太棒了！', '真厉害！', '您真棒！', '太好了！']

interface TrainingState {
  currentRound: number
  targetId: string
  optionIds: string[]
  hintLevel: number
  score: number
  answered: boolean
  selectedId: string | null
  showBloom: boolean
  message: string
  totalRounds: number
}

export default function Faces() {
  const { faces, updateFace, addFlower, completeFamilyTask, familyTasks } = useGardenStore()
  const [mode, setMode] = useState<'album' | 'training'>('album')
  const [selectedFaceId, setSelectedFaceId] = useState<string | null>(null)
  const [training, setTraining] = useState<TrainingState | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  const selectedFace = faces.find((f) => f.id === selectedFaceId)

  const pickFacesForRound = (round: number) => {
    const sorted = [...faces].sort((a, b) => a.difficulty - b.difficulty)
    const maxDifficulty = Math.min(1 + Math.floor(round / 2), 3)
    const pool = sorted.filter((f) => f.difficulty <= maxDifficulty)
    const targetIndex = round % pool.length
    const target = pool[targetIndex]
    const numOptions = Math.min(2 + Math.floor(round / 2), 4)
    const distractors = faces.filter((f) => f.id !== target.id).sort(() => Math.random() - 0.5).slice(0, numOptions - 1)
    const options = [target, ...distractors].sort(() => Math.random() - 0.5)
    return { targetId: target.id, optionIds: options.map((o) => o.id) }
  }

  const startTraining = () => {
    const { targetId, optionIds } = pickFacesForRound(0)
    setTraining({ currentRound: 0, targetId, optionIds, hintLevel: 0, score: 0, answered: false, selectedId: null, showBloom: false, message: '', totalRounds: Math.min(3 + Math.floor(faces.length / 2), 5) })
    setMode('training')
    setShowSummary(false)
  }

  const nextRound = () => {
    if (!training) return
    const next = training.currentRound + 1
    if (next >= training.totalRounds) {
      setShowSummary(true)
      const faceTask = familyTasks.find((t) => t.taskType === 'face' && !t.completed)
      if (faceTask) completeFamilyTask(faceTask.id)
      return
    }
    const { targetId, optionIds } = pickFacesForRound(next)
    setTraining({ ...training, currentRound: next, targetId, optionIds, hintLevel: 0, answered: false, selectedId: null, showBloom: false, message: '' })
  }

  const handleSelect = (faceId: string) => {
    if (!training || training.answered) return
    const isCorrect = faceId === training.targetId
    const targetFace = faces.find((f) => f.id === training.targetId)!

    if (isCorrect) {
      updateFace(training.targetId, { successCount: targetFace.successCount + 1, lastPracticed: new Date().toISOString().split('T')[0] })
      const colors = ['#F2B5C8', '#f8a863', '#8bc48d', '#F4D35E', '#7dd3fc']
      addFlower({ type: 'recognition', x: Math.random() * 80 + 10, y: Math.random() * 60 + 20, color: colors[Math.floor(Math.random() * colors.length)], bloomDate: new Date().toISOString().split('T')[0] })
      setTraining({ ...training, answered: true, selectedId: faceId, showBloom: true, score: training.score + 1, message: `${encouragements[training.currentRound % encouragements.length]}您认出了${targetFace.name}！` })
    } else {
      const newHint = training.hintLevel + 1
      if (newHint === 1) {
        setTraining({ ...training, hintLevel: newHint, selectedId: faceId, message: `这是您的${targetFace.relation}，再想想？` })
      } else if (newHint === 2) {
        setTraining({ ...training, hintLevel: newHint, selectedId: null, message: `看看${featureHints[targetFace.relation] || '熟悉的面容'}，能想起来吗？` })
      } else {
        updateFace(training.targetId, { lastPracticed: new Date().toISOString().split('T')[0] })
        setTraining({ ...training, hintLevel: newHint, answered: true, selectedId: null, message: `这是${targetFace.name}，没关系，下次一定行！` })
      }
    }
  }

  const targetFace = training ? faces.find((f) => f.id === training.targetId) : null

  if (mode === 'training' && training && !showSummary) {
    return (
      <div className="min-h-screen bg-forest-50 p-4 font-body">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { setMode('album'); setTraining(null) }} className="p-2 rounded-garden bg-white shadow-soft"><ArrowLeft className="w-6 h-6 text-forest-600" /></button>
          <h1 className="text-xl font-display text-forest-700">认人训练</h1>
          <span className="ml-auto text-sunset-500 font-display">{training.currentRound + 1} / {training.totalRounds}</span>
        </div>

        <div className="flex justify-center mb-6">
          <motion.div className="bg-white rounded-garden-lg shadow-garden p-6 flex flex-col items-center" initial={{ rotateY: 0 }} animate={{ rotateY: training.answered && training.selectedId ? [0, 90, 0] : 0 }} transition={{ duration: 0.6 }}>
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-sunset-300 shadow-warm mb-3">
              <img src={targetFace?.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <p className="text-forest-600 font-display text-lg">这是谁？</p>
          </motion.div>
        </div>

        {training.message && (
          <motion.div className="bg-white/80 rounded-garden p-4 mb-4 flex items-center gap-2 shadow-soft" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={training.message}>
            <MessageCircle className="w-5 h-5 text-sunset-400 shrink-0" />
            <p className="text-forest-700 font-body">{training.message}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4">
          <AnimatePresence>
            {training.optionIds.map((oid, i) => {
              const opt = faces.find((f) => f.id === oid)!
              const isCorrect = oid === training.targetId
              const isSelected = oid === training.selectedId
              return (
                <motion.button key={oid} className={`bg-white rounded-garden-lg shadow-soft p-4 flex flex-col items-center gap-2 border-2 ${isSelected && isCorrect ? 'border-forest-400' : isSelected ? 'border-sunset-300' : 'border-transparent'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, x: isSelected && !isCorrect ? [0, -4, 4, -4, 0] : 0 }} transition={{ delay: i * 0.1, x: { duration: 0.4 } }} onClick={() => handleSelect(oid)} whileTap={{ scale: 0.96 }}>
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-forest-200"><img src={opt.photoUrl} alt="" className="w-full h-full object-cover" /></div>
                  <span className="text-forest-700 font-body">{opt.name}</span>
                  <span className="text-xs text-forest-400">{opt.relation}</span>
                  {training.answered && isCorrect && <Check className="w-5 h-5 text-forest-500" />}
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>

        {training.showBloom && (
          <motion.div className="flex justify-center my-2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.3, 1], opacity: 1 }} transition={{ duration: 0.8 }}>
            <Flower2 className="w-12 h-12 text-petal-400" />
          </motion.div>
        )}

        {training.answered && (
          <motion.div className="flex justify-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button onClick={nextRound} className="flex items-center gap-2 bg-forest-500 text-white px-8 py-3 rounded-garden-lg shadow-garden font-display text-lg">
              {training.currentRound + 1 >= training.totalRounds ? '查看总结' : '下一题'} <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    )
  }

  if (showSummary && training) {
    return (
      <div className="min-h-screen bg-forest-50 p-4 font-body flex flex-col items-center justify-center">
        <motion.div className="bg-white rounded-garden-lg shadow-garden-lg p-8 text-center max-w-sm w-full" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Sparkles className="w-12 h-12 text-sunset-400 mx-auto mb-4" />
          <h2 className="text-2xl font-display text-forest-700 mb-2">训练完成！</h2>
          <div className="flex justify-center gap-1 my-4">
            {Array.from({ length: training.score }).map((_, i) => (
              <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }}>
                <Flower2 className="w-8 h-8 text-petal-400" />
              </motion.div>
            ))}
          </div>
          <p className="text-forest-600 font-body mb-1">您认出了 <span className="text-sunset-500 font-display text-xl">{training.score}</span> 位家人</p>
          <p className="text-forest-400 text-sm mb-6">花园里又多了 {training.score} 朵小花 🌸</p>
          <button onClick={() => { setMode('album'); setTraining(null); setShowSummary(false) }} className="bg-forest-500 text-white px-8 py-3 rounded-garden-lg shadow-garden font-display text-lg">回到相册</button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-forest-50 p-4 font-body">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="p-2 rounded-garden bg-white shadow-soft"><ArrowLeft className="w-6 h-6 text-forest-600" /></Link>
        <h1 className="text-2xl font-display text-forest-700">家人相册</h1>
        <Users className="w-6 h-6 text-forest-400 ml-auto" />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {faces.map((face, i) => (
          <motion.button key={face.id} className="bg-white rounded-garden-lg shadow-soft p-3 flex flex-col items-center gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} onClick={() => setSelectedFaceId(face.id)} whileTap={{ scale: 0.96 }}>
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-forest-200 shadow-garden">
              <img src={face.photoUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-forest-700 font-display text-sm">{face.name}</span>
            <span className="text-xs text-forest-400 bg-forest-50 px-2 py-0.5 rounded-full">{face.relation}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedFace && (
          <motion.div className="fixed inset-0 bg-black/30 flex items-end justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedFaceId(null)}>
            <motion.div className="bg-white rounded-t-garden-lg shadow-garden-lg p-6 w-full max-w-sm" initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-sunset-300 shadow-warm">
                  <img src={selectedFace.photoUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-display text-forest-700">{selectedFace.name}</h3>
                <div className="flex items-center gap-2 text-forest-500">
                  <Heart className="w-4 h-4 text-petal-400" />
                  <span className="font-body">{selectedFace.relation}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-forest-400 mt-2">
                  <span>练习 {selectedFace.successCount} 次</span>
                  <span>难度 {'⭐'.repeat(selectedFace.difficulty)}</span>
                </div>
                <button onClick={() => { setSelectedFaceId(null); startTraining() }} className="mt-2 flex items-center gap-2 bg-sunset-400 text-white px-6 py-3 rounded-garden-lg shadow-warm font-display text-lg w-full justify-center">
                  开始训练 <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button onClick={startTraining} className="w-full bg-forest-500 text-white py-4 rounded-garden-lg shadow-garden font-display text-xl flex items-center justify-center gap-2" whileTap={{ scale: 0.97 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Flower2 className="w-6 h-6" /> 开始训练
      </motion.button>
    </div>
  )
}
