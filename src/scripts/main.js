const activeClass = "active";

// Переключение табов
// demo
// button(data-tab-id="tabId1", data-tab-control="tab1") 1
// button(data-tab-id="tabId1", data-tab-control="tab2") 2
// .tab-block(data-tab-id="tabId1", data-tab-block="tab1") 1
// .tab-block(data-tab-id="tabId1", data-tab-block="tab2") 2
const tabIdList = document.querySelectorAll("[data-tab-id]");
if (tabIdList) {
	let tabGroupList = new Set();
	for (const tabId of tabIdList) {
		tabGroupList.add(tabId.dataset.tabId);
	}
	for (const tabGroup of tabGroupList) {
		const tab = {
			controlList: document.querySelectorAll(`[data-tab-id="${tabGroup}"][data-tab-control]`),
			blockList: document.querySelectorAll(`[data-tab-id="${tabGroup}"][data-tab-block]`),
		};

		function tabSwith(name) {
			for (const control of tab.controlList) control.classList.remove(activeClass);
			for (const block of tab.blockList) block.style.display = "none";
			document.querySelector(`[data-tab-id="${tabGroup}"][data-tab-control="${name}"]`).classList.add(activeClass);
			document.querySelector(`[data-tab-id="${tabGroup}"][data-tab-block="${name}"]`).style.display = "";
		}
		tabSwith(tab.controlList[0].dataset.tabControl);

		for (const control of tab.controlList) {
			control.addEventListener("click", () => {
				tabSwith(control.dataset.tabControl);
			});
		}
	}
}

// Слайдер
// https://swiperjs.com/swiper-api
for (const slider of document.querySelectorAll(".main-slider")) {
	var swiper = new Swiper(slider, {
		loop: true,
		slidesPerView: "auto",
		centeredSlides: true,
		speed: 800,
		pagination: {
			el: slider.querySelector(".main-slider__pagination"),
			type: "fraction",
		},
		navigation: {
			nextEl: slider.querySelector(".main-slider__button-next"),
			prevEl: slider.querySelector(".main-slider__button-prev"),
		},
		on: {
			slideChangeTransitionStart: function () {
				let textHeight = "";
				if (document.documentElement.clientWidth <= 767) {
					textHeight = this.slides[this.activeIndex].querySelector(".main-slider__content").scrollHeight + "px";
				}
				this.el.querySelector(".main-slider__button-wrap").style.bottom = textHeight;
			},
		},
	});
}
