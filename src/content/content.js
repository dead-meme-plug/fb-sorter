chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkItem") {
    const itemData = {
      description: getDescription(),
      hasSellerRating: hasSellerRating(),
    };
    sendResponse(itemData);
  }
});

function getDescription() {
  const descElement = document.querySelector(
    ".xz9dl7a.xyri2b.xsag5q8.x1c1uobl.x126k92a span.x6zurak"
  );
  return descElement?.textContent?.trim() || "";
}

function hasSellerRating() {
  const ratingContainer = document.querySelector(".x1lziwak.x1yrsyyn");
  return !!ratingContainer;
}
