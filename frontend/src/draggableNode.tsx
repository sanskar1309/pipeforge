export const DraggableNode: React.FC<{ type: string; label: string }> = ({ type, label }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
    (event.target as HTMLElement).style.cursor = 'grabbing';
  };

  return (
    <div
      className={`draggable ${type}`}
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={(e) => ((e.target as HTMLElement).style.cursor = 'grab')}
      style={{
        cursor: 'grab',
        borderRadius: 8,
        backgroundColor: '#12303f',
        flexDirection: 'column',
      }}
    >
      <span style={{ color: '#e6eef8', fontWeight: 600 }}>{label}</span>
    </div>
  );
};
