const API = "https://api.jikan.moe/v4/";

const getRecommendations = async () => {
    try {
        const response = await fetch(`${API}recommendations/anime`);
        const data = await response.json();
        const animeRecommendations = processRecommendations(data.data);
        
        animeRecommendations.map((anime) => {
            card_Container.innerHTML += `
                <div class="card" style="width: 18rem;">
                    <img src="${anime.img}" class="card-img-top" alt="anime.title">
                    <div class="card-body">
                        <h5 class="card-title">${anime.title}</h5>
                        <button onclick="getAnimeById(${anime.mal_id})" type="button" class="btn btn-info">Ver anime</button>
                    </div>
                </div>
            `});
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const processRecommendations = (data) => {
    let animeList = [];
    data.forEach((element) => {
        element.entry.forEach((recommendation)=>{
            let anime ={
                mal_id: recommendation.mal_id,
                title: recommendation.title,
                img: recommendation.images.jpg.image_url
            };
            animeList.push(anime);
        })
    });
    return cleanData(animeList);
};

const cleanData = (animeList) => {
    const uniqueAnime = Array.from(new Set(animeList.map(a => a.mal_id)))
        .map(id => {
            return animeList.find(a => a.mal_id === id)
        });
    return uniqueAnime;
}

const getAnimeById = async (id) => {
    try {
        const response = await fetch(`${API}anime/${id}`);
        const data = await response.json();
        const anime = data.data;
        
        const anime_genres = anime.genres.map((genre) => genre.name).join(", ");
        const anime_themes = anime.themes.map((theme) => theme.name).join(", ");

        anime_Card.innerHTML = `
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${anime.images.jpg.large_image_url}" class="img-fluid rounded-start" alt="${anime.title}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${anime.title}</h5>
                        <p class="card-text"><small class="text-body-secondary"><strong>Año de emisión: </strong>${anime.year}</small></p>
                        <p class="card-text"><small class="text-body-secondary"><strong>Clasificación: </strong>${anime.rating}</small></p>
                        <p class="card-text"><small class="text-body-secondary"><strong>Tipo de transmisión: </strong> ${anime.type}</small></p>
                        <p class="card-text"><small class="text-body-secondary"><strong>Cantidad de episodios: </strong> ${anime.episodes}</small></p>
                        <p class="card-text"><small class="text-body-secondary"><strong>Emisión: </strong>${anime.status}</small></p>
                        <p class="card-text"><small class="text-body-secondary"><strong>Géneros: </strong>${anime_genres}</small></p>
                        <p class="card-text"><small class="text-body-secondary"><strong>Categorías: </strong>${anime_themes}</small></p>
                        <p class="card-text">${anime.synopsis}</p>
                    </div>
                </div>
            </div>
        </div>
        `;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
