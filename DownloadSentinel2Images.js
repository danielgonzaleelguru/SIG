//Visualización y representación de imágenes con Google Earth Engine
//http://www.gisandbeers.com/componer-visualizar-imagenes-en-google-earth-engine/


//Realizamos una llamada a la colección de imágenes de Sentinel 2
var ColeccionSentinel = ee.ImageCollection ('COPERNICUS/S2')

//Filtramos la totalidad de imágenes por fecha, geometría de coordenada y un 30% de nubes máximo
  .filterDate ('2022-01-01' ,'2022-05-30')
  .filterBounds (geometry)
  .filterMetadata ('CLOUDY_PIXEL_PERCENTAGE', 'Less_Than', 30);

//Imprimimos la lista de imágenes disponibles en la pestaña de Console
print (ColeccionSentinel);



//LLamamos a la imagen satélite específica añadiendo su ID de la colección de imágenes
var ImagenSentinel = ee.Image ('COPERNICUS/S2/20180114T075201_20180114T075512_T36MZC');

//Imprimimos las características de la imagen para consultar sus metadatos
print (ImagenSentinel);

//Añadimos la imagen a la vista haciendo una composición de colores y asignando un nombre de etiqueta en la vista
Map.addLayer (ImagenSentinel, {
     max: 5000.0, 
     min: 0.0,
     gamma: 1.0, 
     bands: ['B8','B4','B3']}, 
     'Capa Sentinel');

//Centramos la imagen en la vista del visor y asignamos un zoom de nivel 9
var banda='B3';
Map.centerObject (ImagenSentinel, 9); 

var projection = ImagenSentinel.select(banda).projection().getInfo();

print(projection);

Export.image.toDrive({
  image: ImagenSentinel.select(banda),
  scale:10,
  crs:'EPSG:4326',
  description: banda,
 /* crs: projection.crs,
  crsTransform: projection.transform,*/
  maxPixels: 3784216672400,
  formatOptions: {
    cloudOptimized: true
  }
  
});
