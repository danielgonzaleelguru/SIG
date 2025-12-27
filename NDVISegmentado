/ 1. Cargar la colección

var poi = ee.Geometry.Point([-74.9802, 10.94526]);

var s2 = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(poi)
  .filterDate('2024-01-01', '2024-12-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));

// 2. CONVERTIR la colección en una sola imagen (Mosaico o Mediana)
// Seleccionamos las bandas ANTES para asegurar homogeneidad
var image = s2.select(['B8', 'B4', 'B3', 'B2']).median().clip(poi.buffer(5000).bounds());

// 3. AHORA calcular el NDVI sobre la imagen resultante
var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
// 2. Aplicar SNIC
// Pasamos el NDVI como entrada principal
var snic = ee.Algorithms.Image.Segmentation.SNIC({
  image: ndvi, 
  size: 20,            // Tamaño de los superpíxeles
  compactness: 0.1,    // 0 para que los bordes sigan la forma de la vegetación
  connectivity: 8, 
  neighborhoodSize: 40
});

// 3. Extraer el NDVI promediado por objeto (Banda 'NDVI_mean')
var ndviObject = snic.select('NDVI_mean');

// 4. Visualización
Map.centerObject(poi, 14);

// NDVI Original (con ruido de píxel)
Map.addLayer(ndvi, {min: 0, max: 0.8, palette: ['white', 'yellow', 'green']}, 'NDVI Original');

// NDVI Segmentado (limpio y basado en objetos)
Map.addLayer(ndviObject, {min: 0, max: 0.8, palette: ['white', 'yellow', 'green']}, 'NDVI SNIC (Object-based)');

// Ver los bordes de los clusters
Map.addLayer(snic.select('clusters').randomVisualizer(), {opacity: 0.3}, 'Bordes SNIC(Cluster)');


Export.image.toDrive({
  image: ndviObject,
  description: 'NDVI_SNIC_Export',
  folder: 'GEE_Outputs', // Nombre de la carpeta en tu Drive
  fileNamePrefix: 'ndvi_segmentado_resultado',
  scale: 10, // Resolución de Sentinel-2
  maxPixels: 1e9, // Para evitar el error de "too many pixels"
  fileFormat: 'GeoTIFF'
});

Export.image.toDrive({
  image: ndviObject,
  description: 'ndvi',
  folder: 'GEE_Outputs', // Nombre de la carpeta en tu Drive
  fileNamePrefix: 'NDVI',
  scale: 10, // Resolución de Sentinel-2
  maxPixels: 1e9, // Para evitar el error de "too many pixels"
  fileFormat: 'GeoTIFF'
});

Export.image.toDrive({
  image: ndviObject,
  description: 'ndvi',
  folder: 'GEE_Outputs', // Nombre de la carpeta en tu Drive
  fileNamePrefix: 'NDVI',
  scale: 10, // Resolución de Sentinel-2
  maxPixels: 1e9, // Para evitar el error de "too many pixels"
  fileFormat: 'GeoTIFF'
});

var clusters = snic.select('clusters');

var vectors = clusters.reduceToVectors({
  geometry: poi.buffer(5000).bounds(),
  scale: 10, // Debe coincidir con la resolución de tu imagen
  geometryType: 'polygon',
  eightConnected: true,
  labelProperty: 'label'
});

Export.table.toDrive({
  collection: vectors,
  folder: 'GEE_Outputs', // Nombre de la carpeta en tu Drive
  description: 'Segmentos_SNIC_NDVI',
  fileFormat: 'SHP'
});




