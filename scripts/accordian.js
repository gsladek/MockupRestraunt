const title = document.querySelector("title").textContent;
const accordian = document.querySelector(".accordian");
const localFaqs = [];
let filteredFaqs = [];
let faqhtml = "";

//Sorting faqs
const sortFAQ = async (type) => {
  const achildren = accordian.children;

  filteredFaqs = localFaqs.filter((item) => {
    if (item.type === type) {
      return item;
    }
  });
  //resetting html
  faqhtml = "";
  //appending  to html
  for (let item = 0; item < filteredFaqs.length; item++) {
    faqhtml += `<div class="accordian--inner" id="item1">
    <div class="accordian--header">
      <div class="accordian--title">${filteredFaqs[item].question}</div>
      <div class="accordian--button">&oplus;</div>
    </div>
    <div class="accordian--body">${filteredFaqs[item].answer}</div>
  </div>`;
    if (accordian != "undefined") {
      accordian.innerHTML = faqhtml;
    }

    //setting up  accordian functionality
    setTimeout(() => {
      achildren[item].addEventListener("click", function () {
        for (let a = 0; a < achildren.length; a++) {
          //filtering out
          if (achildren[a] !== this) {
            achildren[a].classList.remove("active");
          }
        }

        this.classList.toggle("active");
      });
    }, 500);
  }
};

//Loading faqs
const loadFAQ = async (type) => {
  let url = "http://localhost:3001/faq";
  const res = await fetch(url);
  const faqList = await res.json();
  for (let faq = 0; faq < faqList.length; faq++) {
    localFaqs.push(faqList[faq]);
  }
  sortFAQ(type);
};

if (title === "FAQ") {
  loadFAQ("food");
}

export { localFaqs, sortFAQ };
