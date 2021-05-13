const activeClass = "active";

// Переключение табов
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
for (const slider of document.querySelectorAll(".main-slider-w")) {
	var swiper = new Swiper(slider, {
		loop: true,
		slidesPerView: "auto",
		centeredSlides: true,
		speed: 800,
		pagination: {
			el: slider.querySelector(".main-slider-w__pagination"),
			type: "fraction",
		},
		navigation: {
			nextEl: slider.querySelector(".main-slider-w__button-next"),
			prevEl: slider.querySelector(".main-slider-w__button-prev"),
		},
		on: {
			slideChangeTransitionStart: function () {
				let textHeight = "";
				if (document.documentElement.clientWidth <= 767) {
					textHeight = this.slides[this.activeIndex].querySelector(".main-slider-w__content").scrollHeight + "px";
				}
				this.el.querySelector(".main-slider-w__button-wrap").style.bottom = textHeight;
			},
		},
	});
}

// button-active
for (const buttonActive of document.querySelectorAll(".button:not(.button.button_icon)")) {
	buttonActive.addEventListener("click", (event) => {
		const button = buttonActive.getBoundingClientRect(),
			buttonEffect = buttonActive.querySelector(".buttonEffect"),
			buttonEffectHtml = `<div class="buttonEffect" style="top:${event.clientY - 10 - button.y}px; left:${event.clientX - 10 - button.x}px;"></div>`;
		console.log(button);
		console.log(event.clientY);
		if (buttonEffect) buttonEffect.remove();
		buttonActive.insertAdjacentHTML("afterbegin", buttonEffectHtml);
	});
}

// data-doc-card
document.querySelectorAll(".doc-card__card[data-doc-card]").forEach((docCard, key, docCardList) => {
	const button = docCard.querySelector("buttom.doc-card__button");
	button.addEventListener("click", () => {
		for (const item of docCardList) {
			if (item !== docCard) item.classList.remove(activeClass);
		}
		docCard.classList.toggle(activeClass);
	});
});

// https://github.com/michu2k/Accordion
// faq
const helpFaqList = document.querySelectorAll(".help-faq");
if (helpFaqList) {
	for (const helpFaq of helpFaqList) {
		new Accordion(helpFaq, {
			duration: 400,
			elementClass: "help-faq-item",
			triggerClass: "help-faq-item__head",
			panelClass: "help-faq-item__body",
			activeClass: activeClass,
		});
	}
}

// dual-range
class Range {
	constructor(rangeWrap) {
		this.atr = JSON.parse(rangeWrap.dataset.dualRange);
		this.inputs = [];
		this.value = {
			from: this.atr.min,
			to: this.atr.max,
		};
		this.maxRange = +this.atr.max - +this.atr.min;
		this.created(rangeWrap);
		this.getValueInput();
	}
	getValueInput() {
		for (const input of this.inputs) {
			input.item.value = input.course === "from" ? this.value.from : this.value.to;
		}
	}
	created(rangeWrap) {
		for (const elemInput of rangeWrap.querySelectorAll("input[data-course]")) {
			this.inputs.push({
				item: elemInput,
				type: elemInput.dataset.type,
				course: elemInput.dataset.course,
			});
		}
		for (const input of this.inputs) {
			for (const key in this.atr) {
				if (Object.hasOwnProperty.call(this.atr, key)) input.item.setAttribute(key, this.atr[key]);
			}
			input.item.addEventListener("input", () => {
				this.value[input.course] = Number(input.item.value);
				if (input.course === "from" && this.value.from > this.value.to) {
					this.value.to = this.value.from;
				} else if (this.value.to < this.value.from) {
					this.value.from = this.value.to;
				}
				const inputValue = +input.item.value - +this.atr.min,
					data = {
						from: {
							position: (inputValue / this.maxRange) * 100,
							cssProperty: "--range-line-from",
						},
						to: {
							position: 100 - (inputValue / this.maxRange) * 100,
							cssProperty: "--range-line-to",
						},
					}[input.course];

				rangeWrap.style.setProperty(data.cssProperty, data.position + "%");
				this.getValueInput();
			});
		}
	}
}

for (const rangeWrap of document.querySelectorAll("[data-dual-range]")) new Range(rangeWrap);

// Контакты map
class ContactMap {
	constructor(item) {
		this.coord = item.dataset.contactMap.split(", ");
		this.map = item.querySelector(".contact-map__map");
		this.title = item.querySelector(".contact-map__h").innerText;
		this.created();
	}
	created() {
		this.coord = this.coord.map((item) => Number(item));
		ymaps.ready(() => {
			let myMap = new ymaps.Map(this.map, {
					center: this.coord,
					zoom: 13,
					controls: [],
				}),
				MyIcon = ymaps.templateLayoutFactory.createClass(
					// Макет иконки
					'<svg class="contact-map__icon-map" width="53" height="58" fill="none" viewBox="0 0 53 58"  xmlns="http://www.w3.org/2000/svg"><path d="M26.5 53C41.136 53 53 41.136 53 26.5S41.136 0 26.5 0 0 11.864 0 26.5 11.864 53 26.5 53z" fill="#FC4C02"/><path d="M33.88 50.44L26.44 43 19 50.44l7.44 7.44 7.44-7.44z" fill="#FC4C02"/><path d="M21.52 19.087h22.46a19.888 19.888 0 00-11.742-10.72L21.52 19.087z" fill="#fff"/><path d="M45.102 21.764H18.615c-.604 0-1.18-.385-1.412-.944a1.556 1.556 0 01.332-1.666l11.65-11.649A19.184 19.184 0 007.768 30.637h26.765c.604 0 1.18.385 1.41.944a1.558 1.558 0 01-.33 1.665l-12.197 12.2a19.2 19.2 0 0021.682-23.682h.004z" fill="#fff"/><path d="M31.637 33.29H8.757a19.893 19.893 0 0011.652 11.228L31.637 33.29z" fill="#fff"/></svg>'
				),
				myPlacemark = new ymaps.Placemark(
					this.coord,
					{
						hintContent: this.title,
					},
					{
						iconLayout: "default#imageWithContent",
						iconImageHref: "",
						iconImageSize: [53, 58],
						iconImageOffset: [-27, -58],
						iconContentLayout: MyIcon,
					}
				);
			myMap.controls.add("zoomControl", {
				// Кнопки зума на карту
				size: "small",
				position: {
					left: "auto",
					top: "auto",
					bottom: 30,
					right: 20,
				},
			});
			myMap.behaviors.disable("scrollZoom");
			myMap.geoObjects.add(myPlacemark);
		});
	}
}

for (const mapItem of document.querySelectorAll("[data-contact-map]")) new ContactMap(mapItem);

// Галерея слайдер на всю ширену
class GallerySlider {
	constructor(item) {
		this.body = item.querySelector(".gallery-slider__body");
		this.nav = item.querySelector(".gallery-slider__nav");
		this.buttonNext = item.querySelector(".gallery-slider__button-next");
		this.buttonPrev = item.querySelector(".gallery-slider__button-prev");
		this.created();
	}
	created() {
		let galleryNav = new Swiper(this.nav, {
			spaceBetween: 14,
			slidesPerView: 4,
			slidesPerColumn: 1,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,
			breakpoints: {
				// when window width is >= 960px
				960: {
					spaceBetween: 24,
					slidesPerView: 2,
					slidesPerColumn: 2,
				},
			},
		});
		let galleryBody = new Swiper(this.body, {
			spaceBetween: 10,
			navigation: {
				nextEl: this.buttonPrev,
				prevEl: this.buttonNext,
			},
			thumbs: {
				swiper: galleryNav,
			},
		});
	}
}
for (const gallerySlider of document.querySelectorAll(".gallery-slider")) new GallerySlider(gallerySlider);

// Cлайдер advant-slider
for (const slider of document.querySelectorAll(".advant-slider")) {
	let advantSlider = new Swiper(slider, {
		spaceBetween: 24,
		slidesPerView: "auto",
	});
}

// Объекты на карте
class FilterMap {
	constructor(item) {
		this.data = JSON.parse(item.dataset.filterMap);
		this.coordNormal();
		this.points = this.data.points;
		this.created(item);
	}
	coordNormal() {
		// нормализуем координаты
		for (const point of this.data.points) point.coord = point.coord.split(", ").map((item) => Number(item));
		this.data.mapCenter = this.data.mapCenter.split(", ").map((item) => Number(item));
		this.data.mapZoom = Number(this.data.mapZoom);
	}
	created(item) {
		// Инит карыт
		ymaps.ready(() => {
			let myMap = new ymaps.Map(item, {
				center: this.data.mapCenter,
				zoom: this.data.mapZoom,
				controls: [],
			});
			const pointHtml = ymaps.templateLayoutFactory.createClass(
				// Создаём макет содержимого иконки.
				`
					<div class="filter-m-map-point">
						<div class="filter-m-map-point__title">
							<img src="$[properties.imgUrl]" alt="$[properties.name]" class="filter-m-map-point__img">
							<div class="filter-m-map-point__body">
								<div class="filter-m-map-point__name">$[properties.name]</div>
								<div class="filter-m-map-point__metro-wrap">
									<div class="card-main__metro">
										<svg class="metro-color_$[properties.metroBranchNumber]" width="20" height="20">
											<use xlink:href="./assets/images/sprite.svg#metro"></use>
										</svg>
										<span>$[properties.metroName]</span>
									</div>
									<div class="filter-m-map-point__time">
										<svg width="15" height="15">
											<use xlink:href="./assets/images/sprite.svg#little-$[properties.onFoot]"></use>
										</svg>
										<span>$[properties.wayTime]</span>
									</div>
								</div>
								<div class="filter-m-map-point__prise">
									<div class="filter-m-map-point__prise-rub">₽</div>
									от <span>&nbsp$[properties.prise]&nbsp</span> млн/р.
								</div>
							</div>
						</div>
					</div>
				`,
				{
					build: function () {
						pointHtml.superclass.build.call(this);
						const element = this.getParentElement().querySelector(".filter-m-map-point"),
							activeClass = "active";

						const bigShape = {
							type: "Rectangle",
							coordinates: [
								[-10, -10],
								[10, 10],
							],
						};
						this.getData().options.set("shape", bigShape);
						if (this.isActive) {
							element.classList.add(activeClass);
						} else if (this.inited) {
							element.classList.remove(activeClass);
						}
						if (!this.inited) {
							this.isActive = false;
							this.inited = true;
							// При клике по метке будем перестраивать макет.
							this.getData().geoObject.events.add(
								"mouseenter",
								function () {
									this.isActive = !this.isActive;
									this.rebuild();
								},
								this
							);
							this.getData().geoObject.events.add(
								"mouseleave",
								function () {
									this.isActive = !this.isActive;
									this.rebuild();
								},
								this
							);
						}
					},
				}
			);
			// const myCollection = new ymaps.GeoObjectCollection();
			for (const point of this.points) {
				const myPlacemark = new ymaps.Placemark(
					point.coord,
					{
						imgUrl: point.imgUrl,
						metroBranchNumber: point.metroBranchNumber,
						metroName: point.metroName,
						name: point.name,
						onFoot: point.onFoot === "true" ? "man" : "bus",
						prise: point.prise,
						wayTime: point.wayTime,
					},
					{
						iconLayout: pointHtml,
					}
				);
				myMap.geoObjects.add(myPlacemark);
			}

			myMap.controls.add("zoomControl", {
				// Кнопки зума на карту
				size: "small",
				position: {
					left: "auto",
					top: "auto",
					bottom: 30,
					right: 20,
				},
			});
			myMap.behaviors.disable("scrollZoom");
		});
	}
}
for (const filterMMap of document.querySelectorAll(".filter-m-map[data-filter-map]")) new FilterMap(filterMMap);

// map-hide
class MapHide {
	constructor(options) {
		this.block = options.block;
		this.controlList = document.querySelectorAll(`[data-map-hide-control="${options.block.dataset.mapHideBlock}"]`);
		this.created();
		console.log(options.block);
	}
	created() {
		this.block.style.height = "0px";
		let mapOpen = false;
		for (const control of this.controlList) {
			const text = control.querySelector("[data-control-text]"),
				textOld = text.innerText,
				textNew = text.dataset.controlText;
			control.addEventListener("click", () => {
				if (mapOpen) {
					this.block.style.height = "0px";
					text.innerText = textOld
					mapOpen = false;
				} else {
					this.block.style.height = this.block.scrollHeight + "px";
					text.innerText = textNew
					mapOpen = true;
				}
			});
		}
	}
}
for (const block of document.querySelectorAll("[data-map-hide-block]"))
	new MapHide({
		block: block,
	});
