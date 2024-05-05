import { EDUCATION_LOCATIONS } from "./data/education-locations.js";
import { FOOD_LOCATIONS } from "./data/food-locations.js";
import { HEALTHCARE_LOCATIONS } from "./data/healthcare-locations.js";
import { $findElmStrictly, getGoogleMapsUrl, html } from "./util/util.js";

// @ts-ignore
const LEAFLET = /** @type {any} */ (window.L);

/** @returns {void} */
function main() {
  const category = $findElmStrictly("main").dataset.mapCategory;
  if (category === undefined) {
    throw new Error("The 'main' element has no attribute 'data-map-category' set");
  }

  let dataList = FOOD_LOCATIONS;
  if (category === "healthcare") {
    dataList = HEALTHCARE_LOCATIONS;
  } else if (category === "education") {
    dataList = EDUCATION_LOCATIONS;
  }

  initializeMap(dataList);
  initializeLocationList(dataList);
}

/** 
 * @param {import("./data/typedefs.js").TLocationData[]} dataList
  @returns {void} 
 */
function initializeMap(dataList) {
  var map = LEAFLET.map("map", {
    center: [40.744_783, -73.934_14],
    zoom: 13,
  });

  LEAFLET.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    // eslint-disable-next-line quotes
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  for (const location of dataList) {
    const lat = Number.parseFloat(location.lat);
    const lon = Number.parseFloat(location.lon);

    const telephone = location.tel ?? "";
    const telephoneHref = location.tel === undefined ? "" : `tel: ${location.tel}`;

    const descriptionHtml =
      location.description === undefined
        ? ""
        : html`<div><i>${location.description}</i></div>`.toString();

    const locationDataHtml = html`
      <div>
        <div class="my-2">
          <div class="fw-bold">${location.title}</div>
          <div>${location.address}</div>
          <div>
            <span>${location.hours + " • " ?? ""}</span> <a href="${telephoneHref}">${telephone}</a>
          </div>
        </div>
        $${descriptionHtml}
        <div>
          <a href="${getGoogleMapsUrl(lat, lon)}" target="_blank">Get Directions</a>
        </div>
      </div>
    `.toString();

    LEAFLET.marker([lat, lon]).addTo(map).bindPopup(locationDataHtml).openPopup();
  }
}

/** 
 * @param {import("./data/typedefs.js").TLocationData[]} dataList
  @returns {void} 
 */
function initializeLocationList(dataList) {
  const locationsListElement = $findElmStrictly("#locations-list");

  for (const location of dataList) {
    const lat = Number.parseFloat(location.lat);
    const lon = Number.parseFloat(location.lon);

    const telephone = location.tel ?? "";
    const telephoneHref = location.tel === undefined ? "" : `tel: ${location.tel}`;

    const descriptionHtml =
      location.description === undefined
        ? ""
        : html`<div><i>${location.description}</i></div>`.toString();

    const newLiElement = html`
      <li
        class="list-group-item d-flex justify-content-between align-items-start border-bottom p-2"
      >
        <div class="ms-2">
          <div class="fw-bold">${location.title}</div>
          <div>${location.address}</div>
          <div>
            <span>${location.hours + " • " ?? ""}</span> <a href="${telephoneHref}">${telephone}</a>
          </div>
          $${descriptionHtml}
        </div>
        <a
          href="${getGoogleMapsUrl(lat, lon)}"
          target="_blank"
          class="badge text-bg-primary rounded-pill"
          title="Get Directions"
        >
          <img class="directions-logo" src="/images/directions-logo.svg" alt="Get Directions" />
        </a>
      </li>
    `.asElement();

    locationsListElement.append(newLiElement);
  }
}

main();
