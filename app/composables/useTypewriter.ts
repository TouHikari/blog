import { ref, onMounted, onUnmounted } from 'vue'
import { SLOGANS, TYPEWRITER_CONFIG } from '~/utils/constants'

export function useTypewriter() {
  const currentText = ref('')
  const isCursorVisible = ref(true)

  let availableSlogans: string[] = []
  let currentSloganFull = ''
  let charIndex = 0
  let isDeleting = false
  let timeoutId: any = null

  function refillAvailableSlogans() {
    availableSlogans = [...SLOGANS]
  }

  function getNextSlogan(): string {
    if (availableSlogans.length === 0) {
      refillAvailableSlogans()
    }
    const randomIndex = Math.floor(Math.random() * availableSlogans.length)
    const chosenSlogan = availableSlogans.splice(randomIndex, 1)[0]!
    return chosenSlogan
  }

  function typeWriter() {
    let textToShow = ''

    if (isDeleting) {
      textToShow = currentSloganFull.substring(0, charIndex - 1)
      charIndex--
    } else {
      textToShow = currentSloganFull.substring(0, charIndex + 1)
      charIndex++
    }

    currentText.value = textToShow

    let delay = TYPEWRITER_CONFIG.typingSpeed

    if (isDeleting) {
      delay = TYPEWRITER_CONFIG.deletingSpeed
    }

    if (!isDeleting && charIndex === currentSloganFull.length) {
      // Finished typing
      delay = TYPEWRITER_CONFIG.delayBeforeDeleting
      isDeleting = true
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting
      isDeleting = false
      currentSloganFull = getNextSlogan()
      delay = TYPEWRITER_CONFIG.delayBeforeTypingNew
    }

    timeoutId = setTimeout(typeWriter, delay)
  }

  onMounted(() => {
    refillAvailableSlogans()
    currentSloganFull = getNextSlogan()
    typeWriter()
  })

  onUnmounted(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })

  return {
    currentText
  }
}
