import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Clock, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Sparkles,
  CalendarDays,
  Camera,
  ShoppingBag,
  Package,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { AgendaTask } from '../types';

interface AgendaCalendarProps {
  tasks: AgendaTask[];
  onAddTask: (task: AgendaTask) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');

  // New task form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [taskDate, setTaskDate] = useState(selectedDateStr);
  const [taskTime, setTaskTime] = useState('10:00');
  const [category, setCategory] = useState<AgendaTask['category']>('vendas');
  const [priority, setPriority] = useState<AgendaTask['priority']>('alta');
  const [description, setDescription] = useState('');

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateKey = `${year}-${formattedMonth}-${formattedDay}`;
    setSelectedDateStr(dateKey);
    setTaskDate(dateKey);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: AgendaTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      date: taskDate || selectedDateStr,
      time: taskTime,
      category,
      priority,
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  // Quick suggestions for store activities
  const storeActivitySuggestions = [
    { title: 'Fotografar novidades para o Instagram e Catálogo', cat: 'fotos' as const },
    { title: 'Live Shop no Instagram com provador', cat: 'vendas' as const },
    { title: 'Conferir e repor estoque de vestidos', cat: 'estoque' as const },
    { title: 'Enviar encomendas dos Correios / Motoboy', cat: 'vendas' as const },
    { title: 'Fechar caixa e calcular lucros da semana', cat: 'financeiro' as const },
    { title: 'Atendimento VIP agendado no Ateliê', cat: 'cliente' as const },
  ];

  // Filtering tasks
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesStatus = 
      filterStatus === 'all' ? true :
      filterStatus === 'pending' ? !task.completed :
      task.completed;
    return matchesCategory && matchesStatus;
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.time || '').localeCompare(b.time || '');
  });

  // Selected date tasks
  const selectedDayTasks = tasks.filter(t => t.date === selectedDateStr);

  const getCategoryBadge = (cat: AgendaTask['category']) => {
    switch (cat) {
      case 'fotos':
        return { label: 'Fotos & Mídias', icon: Camera, color: 'bg-purple-100 text-purple-800' };
      case 'vendas':
        return { label: 'Vendas / Live', icon: ShoppingBag, color: 'bg-rose-100 text-rose-800' };
      case 'estoque':
        return { label: 'Estoque / Peças', icon: Package, color: 'bg-amber-100 text-amber-800' };
      case 'financeiro':
        return { label: 'Financeiro', icon: DollarSign, color: 'bg-emerald-100 text-emerald-800' };
      case 'cliente':
        return { label: 'Atendimento VIP', icon: UserCheck, color: 'bg-blue-100 text-blue-800' };
      default:
        return { label: 'Eternal Chic', icon: Tag, color: 'bg-stone-100 text-stone-800' };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#F5E6E8] text-[#722F37]">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-serif-chic font-bold text-gray-900">
              Agenda & Calendário Eternal Chic
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Organize os afazeres da loja no dia a dia: fotos, lives, envio de pedidos, compras e atendimentos.
          </p>
        </div>

        <button
          onClick={() => {
            setTaskDate(selectedDateStr);
            setShowAddForm(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#722F37] hover:bg-[#581C26] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-98"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Agendar Afazer da Loja</span>
        </button>
      </div>

      {/* Modal / Add Task Drawer */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 border border-gray-200 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-serif-chic font-bold text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#722F37]" />
                Adicionar Atividade na Agenda
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              {/* Quick suggestions */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  Sugestões Rápidas de Loja:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {storeActivitySuggestions.slice(0, 4).map((sugg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setTitle(sugg.title);
                        setCategory(sugg.cat);
                      }}
                      className="text-[10px] px-2 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-[#F5E6E8] hover:text-[#722F37] transition-colors"
                    >
                      + {sugg.title.split(' ')[0]} {sugg.title.split(' ')[1]}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  O que você vai fazer? *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sessão de fotos vestidos vinho + Live Shop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#722F37] focus:outline-none"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#722F37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#722F37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Tipo de Tarefa
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white focus:ring-1 focus:ring-[#722F37]"
                  >
                    <option value="vendas">Vendas / Live Shop</option>
                    <option value="fotos">Fotos / Mídias Sociais</option>
                    <option value="estoque">Estoque / Fornecedor</option>
                    <option value="financeiro">Financeiro / Fechamento</option>
                    <option value="cliente">Atendimento VIP</option>
                    <option value="atelie">Ateliê / Confecção</option>
                    <option value="outro">Outro Afazer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white focus:ring-1 focus:ring-[#722F37]"
                  >
                    <option value="alta">🔴 Alta</option>
                    <option value="media">🟡 Média</option>
                    <option value="baixa">🟢 Baixa</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Detalhes / Observações (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Levar arara portátil, conferir modelos tamanho M..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-[#722F37] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#722F37] text-white text-xs font-bold hover:bg-[#581C26] shadow-xs"
                >
                  Salvar na Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Grid: Interactive Calendar on Left (6 cols), Daily Task List on Right (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif-chic font-bold text-gray-900">
              {monthNames[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                title="Mês anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Hoje
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                title="Próximo mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-gray-400 py-1 border-b border-gray-100">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty prefix cells */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-lg bg-gray-50/50" />
            ))}

            {/* Month Day Cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedMonth = String(month + 1).padStart(2, '0');
              const formattedDay = String(dayNum).padStart(2, '0');
              const cellDateStr = `${year}-${formattedMonth}-${formattedDay}`;

              const isSelected = cellDateStr === selectedDateStr;
              const isToday = cellDateStr === new Date().toISOString().split('T')[0];
              const dayTasks = tasks.filter(t => t.date === cellDateStr);
              const hasTasks = dayTasks.length > 0;
              const hasPending = dayTasks.some(t => !t.completed);

              return (
                <button
                  key={dayNum}
                  onClick={() => handleDayClick(dayNum)}
                  className={`
                    relative h-10 sm:h-12 rounded-lg flex flex-col items-center justify-center p-1 text-xs font-semibold transition-all
                    ${isSelected 
                      ? 'bg-[#722F37] text-white shadow-xs font-bold scale-102 z-10' 
                      : isToday 
                        ? 'bg-amber-50 text-amber-900 border border-amber-300 font-bold' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  <span>{dayNum}</span>

                  {hasTasks && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isSelected 
                          ? 'bg-amber-300' 
                          : hasPending 
                            ? 'bg-[#722F37]' 
                            : 'bg-emerald-500'
                      }`} />
                      {dayTasks.length > 1 && (
                        <span className={`text-[9px] ${isSelected ? 'text-amber-200' : 'text-gray-500'}`}>
                          {dayTasks.length}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#722F37]" /> Tarefa Pendente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Concluída
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Dia de Hoje
            </span>
          </div>
        </div>

        {/* Selected Day Task List & Store To-Dos */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-serif-chic font-bold text-gray-900">
                  Tarefas de {selectedDateStr.split('-').reverse().join('/')}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedDayTasks.length} atividade(s) agendada(s) para este dia
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilterStatus(filterStatus === 'all' ? 'pending' : 'all')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${
                    filterStatus === 'pending'
                      ? 'bg-[#722F37] text-white border-[#722F37]'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {filterStatus === 'pending' ? 'Ver Todas' : 'Só Pendentes'}
                </button>
              </div>
            </div>

            {/* Task Items */}
            <div className="space-y-3 mt-4 max-h-[400px] overflow-y-auto pr-1">
              {filteredTasks.filter(t => t.date === selectedDateStr).length > 0 ? (
                filteredTasks.filter(t => t.date === selectedDateStr).map((task) => {
                  const badge = getCategoryBadge(task.category);
                  const Icon = badge.icon;

                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                        task.completed 
                          ? 'bg-gray-50/70 border-gray-200 opacity-70' 
                          : 'bg-white border-gray-200 hover:border-[#722F37]/30 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 text-gray-400 hover:text-emerald-600 transition-colors"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 hover:text-[#722F37]" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <p className={`text-xs sm:text-sm font-semibold ${task.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {task.title}
                          </p>

                          <div className="flex items-center gap-2 flex-wrap text-[11px] text-gray-500">
                            {task.time && (
                              <span className="flex items-center gap-1 text-gray-600">
                                <Clock className="w-3 h-3" /> {task.time}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${badge.color}`}>
                              {badge.label}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                              task.priority === 'alta' ? 'text-rose-700 bg-rose-50' : 'text-gray-600 bg-gray-100'
                            }`}>
                              {task.priority}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-[11px] text-gray-600 pt-0.5">{task.description}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-gray-300 hover:text-rose-600 p-1 transition-colors"
                        title="Excluir afazer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-sm text-gray-400 space-y-2">
                  <CalendarDays className="w-8 h-8 text-gray-300 mx-auto" />
                  <p>Nenhuma atividade para esta data.</p>
                  <button
                    onClick={() => {
                      setTaskDate(selectedDateStr);
                      setShowAddForm(true);
                    }}
                    className="text-xs text-[#722F37] font-semibold hover:underline"
                  >
                    + Agendar algo para {selectedDateStr.split('-').reverse().join('/')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => {
              setTaskDate(selectedDateStr);
              setShowAddForm(true);
            }}
            className="w-full py-2.5 rounded-lg border-2 border-dashed border-[#722F37]/30 text-[#722F37] text-xs font-bold hover:bg-[#F5E6E8]/50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Tarefa para o dia {selectedDateStr.split('-').reverse().join('/')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
