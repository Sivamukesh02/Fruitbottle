import React, { useState, useRef } from "react";
import "../assets/Style/style.css";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import bottle1 from "../assets/Image/greenapplebottle.png";
import bottle2 from "../assets/Image/kiwibottle.png";
import bottle3 from "../assets/Image/strawberrybottle.png";
import fruit1 from "../assets/Image/greenapplefruit.png";
import fruit2 from "../assets/Image/kiwifruit.png";
import fruit3 from "../assets/Image/strawberryfruit.png";

const drinks = [
  {
    id: "apple",
    word: "Green Apple",
    name: "Green Apple Juice",
    sub: "Cold-Pressed Orchard Crisp Juice",
    bottle: bottle1,
    fruit: fruit1,
    c1: "#bde58a",
    c2: "#5fa84a",
    glow: "#eaffb0",
    region: "Shimla, India",
    abv: "0%",
    vintage: "2026",
    notes: ["Crisp Apple", "Mint", "Lime Zest", "Honey"],
    pairing: "Cream Cheese Toast, Oat Cookies, Fresh Salad",
    price: 120,
  },
  {
    id: "kiwi",
    word: "Kiwi Juice",
    name: "Kiwi Juice",
    sub: "Zesty Tropical Kiwi Cooler",
    bottle: bottle2,
    fruit: fruit2,
    c1: "#d6e86b",
    c2: "#6c9a1f",
    glow: "#f4ff8a",
    region: "Ooty, India",
    abv: "0%",
    vintage: "2026",
    notes: ["Tangy Kiwi", "Passion Fruit", "Lemon", "Basil"],
    pairing: "Grilled Paneer, Fruit Tart, Coconut Pudding",
    price: 140,
  },
  {
    id: "strawberry",
    word: "Strawberry",
    name: "Strawberry Juice",
    sub: "Sweet Berry Blush Juice",
    bottle: bottle3,
    fruit: fruit3,
    c1: "#ff9aa9",
    c2: "#d93d5e",
    glow: "#ffd0d9",
    region: "Mahabaleshwar, India",
    abv: "0%",
    vintage: "2026",
    notes: ["Ripe Strawberry", "Vanilla", "Rose", "Cream"],
    pairing: "Cheesecake, Waffles, Dark Chocolate",
    price: 150,
  },
];

// 4 corner fruits: top-left, top-right, bottom-left, bottom-right
const corners = ["tl", "tr", "bl", "br"];
const flyFrom = [
  { x: -400, y: -300 },
  { x: 400, y: -300 },
  { x: -400, y: 300 },
  { x: 400, y: 300 },
];

// New slide: word rise + fruits fly-in
const animateIn = (swiper) => {
  const slide = swiper.slides[swiper.activeIndex];
  if (!slide) return;
  const word = slide.querySelector(".word");
  const fruits = slide.querySelectorAll(".fruit");

  gsap.killTweensOf([word, fruits]);

  gsap.fromTo(
    word,
    { y: 70, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }
  );
  gsap.fromTo(
    fruits,
    {
      x: (i) => flyFrom[i].x,
      y: (i) => flyFrom[i].y,
      scale: 0,
      opacity: 0,
      rotation: 200,
    },
    {
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1,
      stagger: 0.12,
      ease: "back.out(1.5)",
    }
  );
};

// Old slide: fruits corners ku swipe aagi poidum
const animateOut = (swiper) => {
  const slide = swiper.slides[swiper.previousIndex];
  if (!slide || swiper.previousIndex === swiper.activeIndex) return;
  gsap.to(slide.querySelectorAll(".fruit"), {
    x: (i) => flyFrom[i].x,
    y: (i) => flyFrom[i].y,
    scale: 0,
    opacity: 0,
    rotation: -160,
    duration: 0.6,
    ease: "power2.in",
  });
};

function Proj() {
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(false);
  const bottleRef = useRef(null);

  // Bottle spin illa - palaya bottle poidum, puthu bottle apdiye varum
  const changeBottle = (index) => {
    if (bottleRef.current) bottleRef.current.src = drinks[index].bottle;
  };

  const placeOrder = () => {
    setSelected(null);
    setToast(true);
    setTimeout(() => setToast(false), 2600);
  };

  return (
    <div className="proj">
      <h3 className="brand">Fresh Press Juices</h3>

      <Swiper
        modules={[Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation
        speed={900}
        onSwiper={(s) => setTimeout(() => animateIn(s), 60)}
        onSlideChangeTransitionStart={(s) => {
          animateOut(s);
          animateIn(s);
          changeBottle(s.activeIndex);
        }}
        className="mySwiper"
      >
        {drinks.map((d) => (
          <SwiperSlide key={d.id}>
            <div
              className="page"
              style={{ "--c1": d.c1, "--c2": d.c2, "--glow": d.glow }}
            >
              <h1 className="word">{d.word}.</h1>

              {corners.map((c) => (
                <div key={c} className={`fruit fruit-${c}`}>
                  <img src={d.fruit} alt={d.name} />
                </div>
              ))}

              <motion.button
                className="explore"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSelected(d)}
              >
                {d.name}
              </motion.button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Single bottle layer - slide maarumbothu bottle maathum */}
      <div className="bottle-layer">
        <div className="bottle-wrap">
          <img
            ref={bottleRef}
            className="bottle"
            src={drinks[0].bottle}
            alt="juice bottle"
          />
          <span className="shadow" />
        </div>
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close" onClick={() => setSelected(null)}>
                ✕
              </button>

              <div className="modal-img">
                <img src={selected.bottle} alt={selected.name} />
              </div>

              <div className="modal-info">
                <h2>{selected.name}</h2>
                <p className="sub">{selected.sub}</p>

                <div className="stats">
                  <div>
                    <span>Region</span>
                    <b>{selected.region}</b>
                  </div>
                  <div>
                    <span>ABV</span>
                    <b>{selected.abv}</b>
                  </div>
                  <div>
                    <span>Vintage</span>
                    <b>{selected.vintage}</b>
                  </div>
                </div>

                <span className="label">Tasting Profile</span>
                <div className="chips">
                  {selected.notes.map((n) => (
                    <em key={n}>{n}</em>
                  ))}
                </div>

                <span className="label">Recommended Pairing</span>
                <p className="pair">{selected.pairing}</p>

                <motion.button
                  className="reserve"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={placeOrder}
                >
                  Order Bottle (₹{selected.price})
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order placed toast - bottom right */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            ✓ Order Placed
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Proj;