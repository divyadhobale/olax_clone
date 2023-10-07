import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useRef, useEffect , useState} from 'react';
import mapboxgl from 'mapbox-gl'; 
import MapboxAutocomplete from "react-mapbox-autocomplete";
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from "axios";
import { Card } from 'react-bootstrap';
import  './App.css';

const mapAccess = {
  mapboxApiAccessToken:
      "pk.eyJ1IjoiY2hldGFuYS1raGF3c2UiLCJhIjoiY2xqM3NkaGxkMG92MzNwbzB6cTZranZ5diJ9.HmEUfEtrfUhGUPw6d0p4jQ"
  };
   mapboxgl.accessToken = 'pk.eyJ1IjoiY2hldGFuYS1raGF3c2UiLCJhIjoiY2xqM3NkaGxkMG92MzNwbzB6cTZranZ5diJ9.HmEUfEtrfUhGUPw6d0p4jQ';
  
  function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    let base_fare = 60;
   const [startPoint, setStartPoint] = useState();
   const [endPoint, setEndPoint] = useState();
   const [basePrice, setBasePrice] = useState();
   const [standardPrice, setStandardPrice] = useState();
   const [premiumPrice, setPremiumPrice] = useState();
 
   function _suggestionStartSelect(result, lat, long, text) {
    console.log(result, lat, long, text);
    setStartPoint([long, lat ])
  }

  function _suggestionEndSelect(result, lat, long, text) {
    console.log(result, lat, long, text);
    setEndPoint([long, lat])

  }

useEffect(() => {
  if (map.current) return; // initialize map only once
  map.current = new mapboxgl.Map({
  container: mapContainer.current,
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [79, 21],
  zoom: 9
  });
  map.current.on('load', () => {
    map.current.addSource('routeData', {
    'type': 'geojson',
    'data': {
    'type': 'Feature',
    'properties': {},
    'geometry': {
    'type': 'LineString',
    'coordinates': [  ] 
    }} });
    map.current.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'routeData',
    'layout': {
    'line-join': 'round',
    'line-cap': 'round'
    },
    'paint': {
    'line-color': 'grey',
    'line-width': 7
    }
    });
    });
   
    
    },[]);
    
    
  
  function findRoute(){
   
          console.log("Find route", startPoint, endPoint)
      let url = `https://api.mapbox.com/directions/v5/mapbox/cycling/${startPoint[0]},${startPoint[1]};${endPoint[0]},${endPoint[1]}?geometries=geojson&access_token=pk.eyJ1Ijoic3VtaXRwYXRpbCIsImEiOiJjazU0eXFweXowYWwyM2VrYjNjc3BhOG5nIn0.8jHA62nA33gUGnnZnwdmVQ`
       axios.get(url).then((res)=>{
               console.log("res", res.data.routes[0]["geometry"])
               map.current.flyTo({
                                  center: startPoint,
                                  essential: true , 
                                  duration:10000,
                                  zoom:11
                                               });
      let routeData = map.current.getSource("routeData").setData(res.data.routes[0]["geometry"]);
  
  
  
    let n=(res.data.routes[0]["geometry"]["coordinates"]).length-1;
                   //    console.log(res.data.routes[0]["geometry"]["coordinates"])
    const marker1 =  new mapboxgl.Marker()
         .setLngLat(res.data.routes[0]["geometry"]["coordinates"]["0"]).addTo(map.current);
    const marker2=new mapboxgl.Marker()
         .setLngLat(res.data.routes[0]["geometry"]["coordinates"][n]).addTo(map.current);
      
  
         setBasePrice(base_fare +Math.round(parseInt(res.data.routes[0]["distance"])*0.001*5))
         setStandardPrice(base_fare + 20+ Math.round((res.data.routes[0]["distance"])*0.001*5))
         setPremiumPrice(base_fare + 40 +Math.round((res.data.routes[0]["distance"])*0.001*5))
         // console.log("routeData", routeData)
    })}
  
 
  

return (
  <Container>
         <div className='App' >
         
         <h1>Mapbox location autocomplete</h1>
    From:< MapboxAutocomplete
   publicKey={mapAccess.mapboxApiAccessToken}
   inputClass="form-control search"

   onSuggestionSelect={_suggestionStartSelect}
     country="in"
     resetSearch={false}
      placeholder="Search Adderess..."
    />

To:<MapboxAutocomplete

publicKey={mapAccess.mapboxApiAccessToken}
inputClass="form-control search"

   onSuggestionSelect={_suggestionEndSelect}
   country="in"
   resetSearch={false}
    placeholder="Drop Adderess..."

/>

<Button variant="dark" onClick={()=>{
                       findRoute();}}  >Find Route</Button>           


         
<div ref={mapContainer} className="map-container" > </div>
<Button><Card style={{ width: '150px', height:'10rem',display:'flex',float:'left' }} >
      <Card.Img variant="top" public="1.png" width={5} height={5}/>
      <Card.Body>
        <Card.Title>Micro</Card.Title>
        <Card.Text>
     Rs:{basePrice}
        </Card.Text>
        <Button variant="primary" 
        >Conform ride</Button>
      </Card.Body>
    </Card>
</Button>
 <Button><Card style={{ width: '150px',height:'10rem',display:'flex',float:'left'}}>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Mini</Card.Title>
        <Card.Text>
          Rs:{standardPrice}                         
        </Card.Text>
        <Button variant="primary">Conform ride</Button>
   </Card.Body>
    </Card></Button>   

    <Button onClick><Card style={{ width:'150px',height:'10rem',display:'flex',float:'left'}}>
      <Card.Img variant="center" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Premium</Card.Title>
        <Card.Text>
         Rs:{premiumPrice}
        </Card.Text>
        <Button variant="primary" onClick={()=>alert("confirm ride ")} > Confirm ride</Button>
      </Card.Body>
    </Card></Button><br/>

<div><Button variant="dark" onClick={()=>{
                    findRoute();}} style={{margin:"6px",}} >Confirm Route</Button> </div>
 
                          
 </div> 
   </Container>
);
}



export default App;
