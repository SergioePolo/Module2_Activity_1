const API = "https://api.jikan.moe/v4/";

let recommendations = [];
let currentIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
    getRecommendations();
});

const getRecommendations = async () => {
    try {
        const response = await fetch(`${API}recommendations/anime`);
        const data = await response.json();
        recommendations = processRecommendations(data.data);
        currentIndex = 0;

        card_Container.innerHTML = "";
        loadMore();

        document.getElementById("recommendationsSection").classList.remove("d-none");
        document.getElementById("animeDetailSection").classList.add("d-none");

    } catch (error) {
        card_Container.innerHTML = `<p class="text-danger text-center">❌ Error al cargar recomendaciones.</p>`;
    }
};

const loadMore = () => {
    const batch = recommendations.slice(currentIndex, currentIndex + 10);
    batch.forEach((anime) => {
        card_Container.innerHTML += `
            <div class="col-6 col-md-4 col-lg-2"> 
                <div class="card h-100 text-center shadow-sm">
                    <img src="${anime.img}" class="card-img-top anime-img" alt="${anime.title}">
                    <div class="card-body p-2 d-flex flex-column">
                        <h6 class="card-title small text-truncate" title="${anime.title}">${anime.title}</h6>
                        <button onclick="getAnimeById(${anime.mal_id})" class="btn btn-sm btn-success mt-auto">Detalles</button>
                    </div>
                </div>
            </div>
        `;
    });

    currentIndex += 10;
    document.getElementById("loadMoreBtn").classList.toggle("d-none", currentIndex >= recommendations.length);
};

const processRecommendations = (data) => {
    let animeList = [];
    data.forEach((element) => {
        element.entry.forEach((recommendation) => {
            let anime = {
                mal_id: recommendation.mal_id,
                title: recommendation.title,
                img: recommendation.images.jpg.image_url,
            };
            animeList.push(anime);
        });
    });
    return cleanData(animeList);
};

const cleanData = (animeList) => {
    const uniqueAnime = Array.from(new Set(animeList.map((a) => a.mal_id))).map((id) => {
        return animeList.find((a) => a.mal_id === id);
    });
    return uniqueAnime;
};

const getAnimeById = async (id) => {
    try {
        const response = await fetch(`${API}anime/${id}`);
        const data = await response.json();
        const anime = data.data;

        const anime_genres = anime.genres.map((genre) => genre.name).join(", ");
        const anime_themes = anime.themes.map((theme) => theme.name).join(", ");

        animeDetailSection.innerHTML = `
        <div class="card anime-detail-card shadow-lg">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${anime.images.jpg.large_image_url}" class="img-fluid rounded-start anime-detail-img" alt="${anime.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h3 class="card-title">${anime.title}</h3>
                        <p class="card-text"><strong>Año de emisión:</strong> ${anime.year ?? "Desconocido"}</p>
                        <p class="card-text"><strong>Clasificación:</strong> ${anime.rating ?? "N/A"}</p>
                        <p class="card-text"><strong>Tipo de transmisión:</strong> ${anime.type}</p>
                        <p class="card-text"><strong>Episodios:</strong> ${anime.episodes ?? "N/A"}</p>
                        <p class="card-text"><strong>Estado:</strong> ${anime.status}</p>
                        <p class="card-text"><strong>Géneros:</strong> ${anime_genres}</p>
                        <p class="card-text"><strong>Categorías:</strong> ${anime_themes}</p>
                        <p class="card-text">${anime.synopsis ?? "Sin descripción disponible."}</p>
                        <button class="btn btn-success mt-2" onclick="goBack()">⬅ Volver a recomendaciones</button>
                    </div>
                </div>
            </div>
        </div>
        `;

        document.getElementById("recommendationsSection").classList.add("d-none");
        document.getElementById("animeDetailSection").classList.remove("d-none");

    } catch (error) {
        console.error("Error fetching data:", error);
        animeDetailSection.innerHTML = `<p class="text-danger text-center">❌ No se pudo cargar el anime.</p>`;
    }
};

const goBack = () => {
    document.getElementById("recommendationsSection").classList.remove("d-none");
    document.getElementById("animeDetailSection").classList.add("d-none");
};
