"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./page1.module.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Geolocalizacao() {
    const [location, setLocation] = useState(null);
    const mapaRef = useRef(null);

    useEffect(() => {
        const link = document.createElement("link");
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://api.mapbox.com/mapbox-gl-js/v3.0.0/mapbox-gl.js";
        script.onload = () => {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = [pos.coords.longitude, pos.coords.latitude];
                setLocation(coords);

                mapboxgl.accessToken = TOKEN;
                const map = new mapboxgl.Map({
                    container: mapaRef.current,
                    style: "mapbox://styles/mapbox/streets-v12",
                    center: coords,
                    zoom: 14,
                });

                // Popup personalizado
                const popupContent = `
                    <div style="padding: 15px; font-family: Arial, sans-serif;">
                        <h3 style="margin: 0 0 10px 0; color: #0066ff; font-size: 18px;">
                            📍 Você está aqui!
                        </h3>
                        <div style="margin: 8px 0; color: #555;">
                            <strong>🌍 Coordenadas:</strong><br/>
                            <span style="font-size: 13px;">
                                Latitude: ${pos.coords.latitude.toFixed(6)}<br/>
                                Longitude: ${pos.coords.longitude.toFixed(6)}
                            </span>
                        </div>
                        <div style="margin: 8px 0; color: #555;">
                            <strong>🎯 Precisão:</strong> ${Math.round(pos.coords.accuracy)} metros
                        </div>
                        ${pos.coords.altitude ? 
                            `<div style="margin: 8px 0; color: #555;">
                                <strong>⛰️ Altitude:</strong> ${Math.round(pos.coords.altitude)} metros
                            </div>` : ''
                        }
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #888;">
                            ⏰ ${new Date().toLocaleString('pt-BR')}
                        </div>
                    </div>
                `;

                new mapboxgl.Marker({ 
                    color: "#ff0000",
                    scale: 1.2
                })
                .setLngLat(coords)
                .setPopup(
                    new mapboxgl.Popup({ 
                        offset: 25,
                        closeButton: true,
                        closeOnClick: false,
                        maxWidth: '300px'
                    }).setHTML(popupContent)
                )
                .addTo(map)
                .togglePopup(); // Abre o popup automaticamente
            },
            () => alert("Erro ao obter localização."))
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backButton}>
                    ← Voltar
                </Link>
                <h1>📍 Geolocalização</h1>
                <p>Descubra sua localização atual no mapa</p>
            </div>
            <div className={styles.mapa} ref={mapaRef}>
                {location && (
                    <div className={styles.info}>
                        <h2>📊 Localização Atual</h2>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>🌐 Longitude:</span>
                            <span className={styles.value}>{location[0].toFixed(6)}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>🌐 Latitude:</span>
                            <span className={styles.value}>{location[1].toFixed(6)}</span>
                        </div>
                        <div className={styles.dica}>
                            💡 Clique no marcador vermelho para mais detalhes
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}