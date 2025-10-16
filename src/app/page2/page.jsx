"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./page2.module.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Rota() {
    const [location, setLocation] = useState(null);
    const [destino, setDestino] = useState("");
    const [sugestoes, setSugestoes] = useState([]);
    const mapaRef = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const routeLayerRef = useRef(null);

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js";
        script.onload = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = [pos.coords.longitude, pos.coords.latitude];
                    setLocation(coords);

                    mapboxgl.accessToken = TOKEN;
                    const map = new mapboxgl.Map({
                        container: mapaRef.current,
                        style: "mapbox://styles/mapbox/streets-v12",
                        center: coords,
                        zoom: 14,
                    });

                    mapRef.current = map;

                    // Marcador de localização atual
                    new mapboxgl.Marker({ color: "#0066ff" })
                        .setLngLat(coords)
                        .setPopup(
                            new mapboxgl.Popup().setHTML(
                                "<strong>📍 Sua localização</strong>"
                            )
                        )
                        .addTo(map);
                },
                () => alert("Erro ao obter localização.")
            );
        };
        document.body.appendChild(script);
    }, []);

    const buscarSugestoes = async (texto) => {
        if (texto.length < 3) {
            setSugestoes([]);
            return;
        }

        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    texto
                )}.json?access_token=${TOKEN}&limit=5&language=pt`
            );
            const data = await response.json();
            setSugestoes(data.features || []);
        } catch (error) {
            console.error("Erro ao buscar sugestões:", error);
        }
    };

    const selecionarDestino = async (lugar) => {
        const coords = lugar.geometry.coordinates;
        setDestino(lugar.place_name);
        setSugestoes([]);

        // Remove marcador antigo se existir
        if (markerRef.current) {
            markerRef.current.remove();
        }

        // Adiciona novo marcador de destino
        markerRef.current = new mapboxgl.Marker({ color: "#ff0000" })
            .setLngLat(coords)
            .setPopup(
                new mapboxgl.Popup().setHTML(
                    `<strong>🎯 Destino</strong><br/>${lugar.place_name}`
                )
            )
            .addTo(mapRef.current);

        // Centraliza o mapa mostrando origem e destino
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend(location);
        bounds.extend(coords);
        mapRef.current.fitBounds(bounds, { padding: 100 });

        // Traça a rota
        await tracarRota(location, coords);
    };

    const tracarRota = async (origem, destino) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${origem[0]},${origem[1]};${destino[0]},${destino[1]}?geometries=geojson&access_token=${TOKEN}&language=pt`
            );
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0].geometry;

                // Remove rota anterior se existir
                if (routeLayerRef.current) {
                    if (mapRef.current.getLayer("route")) {
                        mapRef.current.removeLayer("route");
                    }
                    if (mapRef.current.getSource("route")) {
                        mapRef.current.removeSource("route");
                    }
                }

                // Adiciona nova rota
                mapRef.current.addSource("route", {
                    type: "geojson",
                    data: {
                        type: "Feature",
                        properties: {},
                        geometry: route,
                    },
                });

                mapRef.current.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round",
                    },
                    paint: {
                        "line-color": "#0066ff",
                        "line-width": 5,
                        "line-opacity": 0.75,
                    },
                });

                routeLayerRef.current = true;

                // Informações da rota
                const distancia = (data.routes[0].distance / 1000).toFixed(2);
                const duracao = Math.round(data.routes[0].duration / 60);

                // Mostra popup com informações
                const popup = new mapboxgl.Popup({ closeButton: false })
                    .setLngLat(destino)
                    .setHTML(
                        `<div style="padding: 10px;">
                            <strong>📊 Informações da Rota</strong><br/>
                            <strong>Distância:</strong> ${distancia} km<br/>
                            <strong>Tempo estimado:</strong> ${duracao} min
                        </div>`
                    )
                    .addTo(mapRef.current);
            }
        } catch (error) {
            console.error("Erro ao traçar rota:", error);
            alert("Não foi possível traçar a rota.");
        }
    };

    const limparRota = () => {
        setDestino("");
        setSugestoes([]);

        // Remove marcador de destino
        if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
        }

        // Remove rota
        if (routeLayerRef.current) {
            if (mapRef.current.getLayer("route")) {
                mapRef.current.removeLayer("route");
            }
            if (mapRef.current.getSource("route")) {
                mapRef.current.removeSource("route");
            }
            routeLayerRef.current = null;
        }

        // Volta para a localização atual
        if (location) {
            mapRef.current.flyTo({
                center: location,
                zoom: 14,
            });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchPanel}>
                <Link href="/" className={styles.backButton}>
                    ← Voltar
                </Link>
                <h2>🚗 Traçar Rota</h2>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Digite um endereço ou local..."
                        value={destino}
                        onChange={(e) => {
                            setDestino(e.target.value);
                            buscarSugestoes(e.target.value);
                        }}
                        className={styles.searchInput}
                    />
                    {destino && (
                        <button
                            onClick={limparRota}
                            className={styles.clearButton}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {sugestoes.length > 0 && (
                    <div className={styles.sugestoes}>
                        {sugestoes.map((lugar, index) => (
                            <div
                                key={index}
                                className={styles.sugestaoItem}
                                onClick={() => selecionarDestino(lugar)}
                            >
                                <span className={styles.sugestaoIcon}>📍</span>
                                <div>
                                    <div className={styles.sugestaoNome}>
                                        {lugar.text}
                                    </div>
                                    <div className={styles.sugestaoEndereco}>
                                        {lugar.place_name}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {location && (
                    <div className={styles.info}>
                        <strong>📍 Sua localização:</strong>
                        <p>
                            Lat: {location[1].toFixed(4)}, Lng:{" "}
                            {location[0].toFixed(4)}
                        </p>
                    </div>
                )}
            </div>

            <div className={styles.mapa} ref={mapaRef}></div>
        </div>
    );
}
