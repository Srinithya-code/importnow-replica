import React, { useEffect, useRef, useState } from 'react';
import { mountGlobe } from './globe';

const globeCities = [
  ['shanghai', 'Shanghai', 'cn'], ['yiwu', 'Yiwu', 'cn'], ['guangzhou', 'Guangzhou', 'cn'],
  ['mumbai', 'Nhava Sheva', 'in'], ['hyderabad', 'Hyderabad', 'in'], ['chennai', 'Chennai', 'in'],
];

export function Globe({ Flag }) {
  const canvas = useRef(null);
  const labels = useRef({});
  useEffect(() => {
    try {
      return mountGlobe(canvas.current, labels.current);
    } catch (error) {
      console.warn('The globe background could not start.', error);
    }
  }, []);
  return <div className="globe-scene" aria-hidden="true">
    <canvas ref={canvas}/>
    <div className="globe-labels">{globeCities.map(([id, name, country]) => (
      <span className="globe-label" key={id} ref={element => { labels.current[id] = element; }}><Flag country={country}/>{name}</span>
    ))}</div>
  </div>;
}

function VoyageCanvas({ section, onFrame }) {
  const canvas = useRef(null);
  useEffect(() => {
    let cancelled = false;
    let dispose;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      try {
        const { mountVoyage } = await import('./voyage');
        if (!cancelled) dispose = mountVoyage({ canvas: canvas.current, section: section.current, onFrame });
      } catch (error) {
        console.warn('The voyage background could not start.', error);
      }
    }, { rootMargin: '300px' });
    observer.observe(section.current);
    return () => {
      cancelled = true;
      observer.disconnect();
      dispose?.();
    };
  }, [section, onFrame]);
  return <div className="voyage-art" aria-hidden="true"><canvas ref={canvas}/></div>;
}

export function Journey({ Heading, Flag, Icon, steps }) {
  const section = useRef(null);
  const [{ index, route, day }, setVoyage] = useState({ index: 0, route: 0, day: 0 });
  const onFrame = React.useCallback(next => {
    setVoyage(previous => previous.index === next.index && previous.route === next.route && previous.day === next.day ? previous : next);
  }, []);
  const step = steps[index];
  return <section className="journey" id="journey" ref={section}>
    <div className="journey-sticky">
      <VoyageCanvas section={section} onFrame={onFrame}/>
      <div className="wrap journey-ui">
        <span className="live"><i/> Live shipment view</span>
        <div className="journey-heading"><Heading id="journey" description={false}/>
          <div className="step" key={index}><b>{index + 1}</b><div><h3>{step.title}</h3><p>{step.description}</p></div></div>
        </div>
        <div className="shipment-track"><div><Flag country="cn"/><span><b>Shanghai</b><small>Origin port</small></span></div><div className="track"><span className="track-fill" style={{ width: route * 100 + '%' }}/><span className="boat" style={{ left: route * 100 + '%' }}><Icon name="ship"/></span></div><div><span><b>Chennai</b><small>Destination</small></span><Flag country="in"/></div><b>Day {day}</b></div>
      </div>
    </div>
  </section>;
}



