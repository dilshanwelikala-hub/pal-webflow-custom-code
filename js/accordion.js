document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.parentElement;
    const body = item.querySelector('.accordion-body');
    const isOpen = item.classList.contains('active');

    if (isOpen) {
      // COLLAPSE
      body.style.maxHeight = body.scrollHeight + 'px'; // Set to current height to prepare
      body.offsetHeight; // Force reflow
      body.style.maxHeight = '0';
      body.style.paddingTop = '0';
      body.style.paddingBottom = '0';
      item.classList.remove('active');
    } else {
      // EXPAND
      item.classList.add('active');
      body.style.maxHeight = body.scrollHeight + 'px';
      body.style.paddingTop = '1rem';
      body.style.paddingBottom = '1rem';

      // After transition, remove max-height to allow dynamic height
      const clearHeight = () => {
        if (item.classList.contains('active')) {
          body.style.maxHeight = 'none';
        }
        body.removeEventListener('transitionend', clearHeight);
      };
      body.addEventListener('transitionend', clearHeight);
    }
  });
});

var selectedLink;
document.addEventListener("DOMContentLoaded", function () {
    const tocContainer = document.getElementById("toc-container");
    const content = document.getElementById("blog-content"); // Adjust this selector to match your Webflow content area
		const tocToggleContainer = document.getElementById("toc-toggle-container");


    if (!tocContainer || !content || !tocToggleContainer) return;

    const headings = content.querySelectorAll("h2, h3"); // Adjust based on your heading structure
    if (headings.length === 0) return;

    const tocList = document.createElement("ul");
    tocList.classList.add("toc-list");

    const tocLinks = [];

    headings.forEach((heading, index) => {
        const anchorId = `heading-${index}`;
        heading.id = anchorId;

        const listItem = document.createElement("li");
        listItem.classList.add(heading.tagName.toLowerCase()); // Different styling for h2, h3, etc.

        const link = document.createElement("a");
        //link.href = `#${anchorId}`;
        link.href = "javascript:void(0);";
        link.dataset.tag = anchorId;
        link.innerText = heading.innerText;
        link.dataset.target = anchorId; // Store target ID for highlighting
        link.addEventListener("click", (e) => {
            e.preventDefault();
            //setTimeout(() => {
            document.getElementById(anchorId).scrollIntoView({ behavior: "smooth", block: "center" });
						//}, 10); // Delays execution to allow preventDefault() to take effect
            //selectedLink = anchorId;
            // Close TOC after selection on mobile
            if (window.innerWidth <= 991) {
                tocContainer.classList.remove("open");
            }
        });

        tocLinks.push(link);
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });

    // Create TOC toggle button for mobile
    const tocToggle = document.createElement("button");
    tocToggle.innerText = "Expand table of Contents";
    tocToggle.classList.add("toc-toggle");
    tocToggle.addEventListener("click", () => {
        tocContainer.classList.toggle("open");
    });

		tocToggleContainer.appendChild(tocToggle);

    //tocContainer.insertBefore(tocToggle, tocContainer.firstChild);
    tocContainer.appendChild(tocList);

    // Auto-highlight TOC items on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let currentId = entry.target.getAttribute("id");

          tocLinks.forEach((link) => {
            link.classList.remove("active");
            //if (link.getAttribute("href").substring(1) === currentId) {
            //alert(link.dataset.tag.substring(1) + ' ' + currentId);
            if (link.dataset.tag === currentId) {
              link.classList.add("active");
              autoScrollTOC(link);
            }
          });
        }
      });
    }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });

    headings.forEach((heading) => observer.observe(heading));
    
    // Auto-scroll function to keep active TOC item in view
    function autoScrollTOC(activeLink) {
    const parent = tocContainer.querySelector(".toc-list");
    if (!parent || !activeLink) return;

    const scrollParent = tocContainer.closest(".scrollable-container") || tocContainer;
    const linkRect = activeLink.getBoundingClientRect();
    const parentRect = scrollParent.getBoundingClientRect();
    
    const linkOffsetTop = activeLink.offsetTop; // Position inside parent
    const parentScrollTop = parent.scrollTop;
    const parentHeight = parent.clientHeight;
    const linkHeight = activeLink.offsetHeight;

		//alert(window.innerWidth);

    // 🔹 Scroll Up Fix: Check if the link is above the visible area
    if (linkRect.top < parentRect.top) {
    //alert('Top' + linkRect.top + ' ' + parentRect.top);

         if (window.innerWidth <= 991)
        {
        scrollParent.scrollTo({
        		top: linkOffsetTop - parentHeight / 5 + linkHeight / 2,
         behavior: "smooth",
        });
        }
        else
        {
        scrollParent.scrollTo({
        		top: linkOffsetTop - parentHeight / 3 + linkHeight / 2,
         behavior: "smooth",
        });
        } 
    }

    // 🔹 Scroll Down Fix: Check if the link is below the visible area
    else if (linkRect.bottom > parentRect.bottom) {
    //alert('Bottom' + linkRect.bottom + " " + parentRect.bottom);
 
       	if (window.innerWidth <= 991)
        {
            scrollParent.scrollTo({
        		top: linkOffsetTop - parentHeight / 5 + linkHeight,
         behavior: "smooth",
        });
        }
        else
        {
            scrollParent.scrollTo({
        		top: linkOffsetTop - parentHeight / 3 + linkHeight,
         behavior: "smooth",
        });
        }
    }
}

});