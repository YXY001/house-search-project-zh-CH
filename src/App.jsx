import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Search, X, MapPin, Phone, Home, Layers, Image as ImageIcon, User, Users, Star } from 'lucide-react';
import { houses } from './data';
import './App.css';

// Fix for default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

/**
 * WGS-84 to GCJ-02 (Mars Coordinates) conversion
 */
function wgs84togcj02(lng, lat) {
    const PI = 3.1415926535897932384626;
    const a = 6378245.0;
    const ee = 0.00669342162296594323;

    function transformlat(lng, lat) {
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    function transformlng(lng, lat) {
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret;
    }

    let dlat = transformlat(lng - 105.0, lat - 35.0);
    let dlng = transformlng(lng - 105.0, lat - 35.0);
    let radlat = lat / 180.0 * PI;
    let magic = Math.sin(radlat);
    magic = 1 - ee * magic * magic;
    let sqrtmagic = Math.sqrt(magic);
    dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
    dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
    return [lat + dlat, lng + dlng];
}

// Custom component to handle map centering
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      const [cjLat, cjLng] = wgs84togcj02(coords[1], coords[0]);
      map.flyTo([cjLat, cjLng], 15, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
}

const PriceMarkerIcon = (price) => {
  const isNumber = !isNaN(price);
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="price-marker">${isNumber ? '¥' : ''}${price}${isNumber ? '<span>/月</span>' : ''}</div>`,
    iconSize: [80, 40],
    iconAnchor: [40, 20]
  });
};

function App() {
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedContact, setSelectedContact] = useState('all');

  const [initialCenter] = useState(wgs84togcj02(116.596, 39.926));

  // Calculate dynamic contact statistics based on activeCategory
  const contactStats = useMemo(() => {
    const filteredByCat = houses.filter(h => activeCategory === 'all' || h.category === activeCategory);
    
    const stats = filteredByCat.reduce((acc, house) => {
      acc[house.contact] = (acc[house.contact] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(stats)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .map(([name, count]) => ({ 
        name, 
        count,
        shortName: name.split(/[（\(\s]/)[0] // Simple short name for UI
      }));
  }, [activeCategory]);

  const handleMarkerClick = (house) => {
    setSelectedHouse(house);
    setIsDrawerOpen(true);
    setActiveImageIdx(0);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const filteredHouses = houses.filter(h => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          h.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || h.category === activeCategory;
    const matchesContact = selectedContact === 'all' || h.contact === selectedContact;
    return matchesSearch && matchesCategory && matchesContact;
  });

  return (
    <div className="app-container">
      {/* Background Overlay for Mobile */}
      <div className={`overlay ${isDrawerOpen ? 'open' : ''}`} onClick={closeDrawer}></div>

      {/* Floating Search Bar and Filter Pills */}
      <div className="controls">
        <div className="search-bar">
          <Search size={20} color="#64748b" />
          <input 
            type="text" 
            placeholder="搜索房源特点、小区..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <div 
            className={`filter-chip ${activeCategory === 'all' && selectedContact === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('all'); setSelectedContact('all'); }}
          >
            全部
          </div>
          <div 
            className={`filter-chip ${activeCategory === 'individual' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('individual'); setSelectedContact('all'); }}
          >
            <User size={14} /> 个人房源
          </div>
          <div 
            className={`filter-chip ${activeCategory === 'agent' ? 'active' : ''}`}
            onClick={() => { setActiveCategory('agent'); setSelectedContact('all'); }}
          >
            <Users size={14} /> 中介房源
          </div>
        </div>

        {/* Dynamic Contact Selector Row */}
        {contactStats.length > 0 && (
          <div className="contact-filter-row">
            {contactStats.map((contact) => (
              <div 
                key={contact.name}
                className={`contact-chip ${selectedContact === contact.name ? 'active' : ''}`}
                onClick={() => {
                  setSelectedContact(selectedContact === contact.name ? 'all' : contact.name);
                }}
              >
                <Star size={12} fill={selectedContact === contact.name ? 'white' : 'transparent'} />
                <span>{contact.shortName}</span>
                <span className="count">{contact.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen Map Wrapper */}
      <div className="map-wrapper">
        <MapContainer 
          center={initialCenter} 
          zoom={14} 
          scrollWheelZoom={true}
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; Amap'
            url="https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
            subdomains="1234"
          />
          
          {filteredHouses.map((house) => {
            const transformedCoords = wgs84togcj02(house.coords[1], house.coords[0]);
            
            return (
              <Marker 
                key={house.id} 
                position={transformedCoords} 
                icon={PriceMarkerIcon(house.price)}
                eventHandlers={{
                  click: () => handleMarkerClick(house),
                }}
              />
            );
          })}

          {selectedHouse && <RecenterMap coords={selectedHouse.coords} />}
        </MapContainer>
      </div>

      {/* Mobile-App Detail Drawer / Bottom Sheet */}
      <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
        {selectedHouse && (
          <>
            <div className="drawer-header">
              <img 
                src={selectedHouse.images[activeImageIdx]} 
                alt={selectedHouse.title} 
                className="drawer-image"
              />
              <button className="close-btn" onClick={closeDrawer}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-scroll-content">
              <div className="image-roll">
                {selectedHouse.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt="thumbnail" 
                    onClick={() => setActiveImageIdx(idx)}
                    style={{ 
                      borderColor: activeImageIdx === idx ? '#2563eb' : 'transparent', 
                      opacity: activeImageIdx === idx ? 1 : 0.6 
                    }}
                  />
                ))}
              </div>

              <div className={`category-badge ${selectedHouse.category}`}>
                {selectedHouse.category === 'individual' ? (
                  <><User size={12} /> 个人房源 (直接联系)</>
                ) : (
                  <><Users size={12} /> 中介/代理房源</>
                )}
              </div>

              <div className="drawer-price">
                {!isNaN(selectedHouse.price) && '¥'}
                {selectedHouse.price}
                {!isNaN(selectedHouse.price) && <span>/月</span>}
              </div>

              <h2 className="drawer-title">{selectedHouse.title}</h2>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label"><MapPin size={14} /> 区域</div>
                  <div className="info-value">{selectedHouse.location}</div>
                </div>
                <div className="info-item">
                  <div className="info-label"><Home size={14} /> 户型</div>
                  <div className="info-value">{selectedHouse.type}</div>
                </div>
              </div>

              <p className="drawer-description">
                {selectedHouse.description}
              </p>

              <a href={`tel:${selectedHouse.contact.match(/\d+/)?.[0] || ''}`} className="contact-button">
                <Phone size={20} />
                <span>立即联系 {selectedHouse.contact}</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
