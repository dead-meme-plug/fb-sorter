import { BlacklistService } from '../core/BlacklistService.js'

class PopupUI {
    constructor() {
        this.blacklistService = new BlacklistService()
        this.initElements()
        this.loadBlacklist()
        this.setupEventListeners()
    }

    initElements() {
        this.input = document.getElementById('blacklist-input')
        this.list = document.getElementById('blacklist-items')
        this.sortBtn = document.getElementById('sort-btn')
    }

    async loadBlacklist() {
        const blacklist = await this.blacklistService.getBlacklist()
        this.renderBlacklist(blacklist)
    }

    renderBlacklist(items) {
        this.list.innerHTML = items
            .map(
                (item) => `
      <li class="mdc-list-item" data-word="${item}" style="opacity: 0; transform: translateY(10px);">
        <span class="mdc-list-item__text">${item}</span>
        <button class="bin-button">
          <svg class="bin-top" viewBox="0 0 39 7" fill="none">
            <line y1="5" x2="39" y2="5" stroke="currentColor" stroke-width="4"></line>
            <line x1="12" y1="1.5" x2="26.0357" y2="1.5" stroke="currentColor" stroke-width="3"></line>
          </svg>
          <svg class="bin-bottom" viewBox="0 0 33 39" fill="none">
            <mask id="path-1-inside-1_8_19" fill="white">
              <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z"></path>
            </mask>
            <path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="currentColor" mask="url(#path-1-inside-1_8_19)"></path>
            <path d="M12 6L12 29" stroke="currentColor" stroke-width="4"></path>
            <path d="M21 6V29" stroke="currentColor" stroke-width="4"></path>
          </svg>
        </button>
      </li>
    `,
            )
            .join('')

        setTimeout(() => {
            const items = this.list.querySelectorAll('.mdc-list-item')
            items.forEach((item) => {
                item.style.opacity = '1'
                item.style.transform = 'translateY(0)'
            })
        }, 10)
    }

    setupEventListeners() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.input.value.trim()) {
                this.addToBlacklist(this.input.value.trim())
                this.input.value = ''
            }
        })

        this.list.addEventListener('click', (e) => {
            const button = e.target.closest('.bin-button')
            if (button) {
                const item = button.closest('[data-word]')
                this.removeFromBlacklist(item.dataset.word)
            }
        })

        this.sortBtn.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'closeBlacklistedTabs' })
            window.close()
        })
    }

    async addToBlacklist(word) {
        await this.blacklistService.addToBlacklist(word)
        this.loadBlacklist()
    }

    async removeFromBlacklist(word) {
        const item = this.list.querySelector(`[data-word="${word}"]`)
        if (item) {
            item.style.transition = 'opacity 0.3s ease'
            item.style.opacity = '0'
            await new Promise((resolve) => setTimeout(resolve, 300))
            await this.blacklistService.removeFromBlacklist(word)
            this.loadBlacklist()
        }
    }
}

new PopupUI()
