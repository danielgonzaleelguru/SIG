// 1. Cargar el dataset MERIT Hydro (Ruta correcta)
// Este dataset ya contiene la banda 'hand' calculada a nivel global
var roi = geometry.bounds();

var merit = ee.Image("MERIT/Hydro/v1_0_1").clip(roi);


// 2. Seleccionar la banda HAND
var hand = merit.select('hnd');

// 3. Opcional: Definir un área de interés (ejemplo: cuenca o ciudad)
// Si no defines una, se mostrará a nivel global
Map.centerObject(roi,11); 

// 4. Configurar la visualización
// Los valores bajos (azul) indican zonas casi al mismo nivel del río
var handVis = {
  min: 0, 
  max: 20, 
  palette: ['#011f4b', '#005b96', '#6497b1', '#b3cde0', '#f1f1f1']
};

// 5. Agregar al mapa
Map.addLayer(hand, handVis, 'Modelo HAND (Susceptibilidad)');

// 6. Crear una máscara para resaltar solo zonas de "Muy Alta Susceptibilidad" (0-5m)
var altaSusceptibilidad = hand.lte(5);
Map.addLayer(altaSusceptibilidad.updateMask(altaSusceptibilidad), 
             {palette: 'red'}, 
             'Zonas Críticas (< 5m)');
             


Export.image.toDrive({
  image: hand,
  description: 'ModeloHand',
  folder: 'GEE_Outputs', // Nombre de la carpeta en tu Drive
  fileNamePrefix: 'ModeloHand',
  scale: 10, // Resolución de Sentinel-2
  maxPixels: 1e9, // Para evitar el error de "too many pixels"
  fileFormat: 'GeoTIFF'
});

Export.image.toDrive({
  image: altaSusceptibilidad,
  description: 'AltaSusceptibilidad',
  folder: 'GEE_Outputs', // Nombre de la carpeta en tu Drive
  fileNamePrefix: 'AltaSusceptibilidad',
  scale: 10, // Resolución de Sentinel-2
  maxPixels: 1e9, // Para evitar el error de "too many pixels"
  fileFormat: 'GeoTIFF'
});
