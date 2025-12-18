import './style.css';

const items = [
  { color: '#00ff00', label: '1' },
  { color: '#ff9900', label: 'від 0.9' },
  { color: '#ff3300', label: '0.9-0.8' },
  { color: '#990000', label: '0.8-0.4' },
  { color: '#000000', label: 'до 0.4' },
];

export default function Legend() {
  return (
    <aside className="legend">
      <h4>Інтенсивність пожеж</h4>
       <p className="legend-item">Кількість палива, що залишилось на ділянці, де 1 це відсутність пожежі, а менше 0.4 все згоріло</p>
      {items.map(item => (
        <div key={item.label} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: item.color }} />
          <span className="legend-label">{item.label}</span>
        </div>
      ))}

      <h4>Додаткові інструкції</h4>
      <p className="legend-item">Ця карта показує зміни зон пожеж у часі. Використовуйте бігунок часу для перегляду змін.</p>

      <h4>Примітки</h4>
      <p className="legend-item">Лінійка дозволяє вимірювати відстані між точками на карті.</p>
    </aside>
  );
}