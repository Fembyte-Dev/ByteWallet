import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LineChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const [timeFilter, setTimeFilter] = useState('mensual'); // mensual, trimestral, anual
  
  // Datos simulados
  const mockData = {
    balance: 12500,
    ingresos: 4500,
    gastos: 2300,
    ahorros: 2200, // Nuevo campo
    metaAhorro: {
      actual: 9500,
      objetivo: 15000,
      nombre: "Vacaciones"
    },
    historico: {
      ingresos: [3800, 4200, 4500, 4500, 4800, 4500],
      gastos: [2100, 2400, 2300, 2500, 2100, 2300]
    },
    deudas: [
      { tipo: 'Tarjeta Crédito', monto: 7500, tasa: '18%', fechaPago: '28/03/2025' },
      { tipo: 'Préstamo Personal', monto: 5000, tasa: '12%', fechaPago: '15/03/2025' },
    ],
    categoriasGastos: [
      { nombre: 'Alimentación', porcentaje: 40, monto: 920 },
      { nombre: 'Transporte', porcentaje: 25, monto: 575 },
      { nombre: 'Ocio', porcentaje: 20, monto: 460 },
      { nombre: 'Servicios', porcentaje: 15, monto: 345 },
    ],
    transacciones: [
      { tipo: 'ingreso', monto: 2000, descripcion: 'Salario', fecha: '01/03/2025' },
      { tipo: 'gasto', monto: 150, descripcion: 'Supermercado', fecha: '05/03/2025' },
      { tipo: 'deuda', monto: 300, descripcion: 'Pago tarjeta', fecha: '10/03/2025' },
      { tipo: 'gasto', monto: 85, descripcion: 'Restaurante', fecha: '12/03/2025' },
      { tipo: 'ahorro', monto: 500, descripcion: 'Ahorro vacaciones', fecha: '12/03/2025' },
    ],
    consejosFinancieros: [
      "Considera reducir gastos en ocio para alcanzar tu meta de ahorro más rápido",
      "El próximo pago de deuda es en 3 días. Asegúrate de tener fondos disponibles",
      "Estás gastando un 5% más en alimentación respecto al mes pasado"
    ]
  };

  // Cálculo de presupuesto disponible
  const presupuestoDisponible = mockData.ingresos - mockData.gastos - mockData.ahorros;
  
  // Cálculo del progreso de ahorro
  const progresoAhorro = (mockData.metaAhorro.actual / mockData.metaAhorro.objetivo) * 100;

  // Datos para el gráfico
  const chartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        data: mockData.historico.ingresos,
        color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: mockData.historico.gastos,
        color: (opacity = 1) => `rgba(198, 40, 40, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Ingresos", "Gastos"]
  };

  const renderTimeFilter = () => (
    <ThemedView style={styles.filterContainer}>
      <TouchableOpacity 
        style={[styles.filterButton, timeFilter === 'mensual' && styles.filterButtonActive]}
        onPress={() => setTimeFilter('mensual')}
      >
        <ThemedText style={[styles.filterText, timeFilter === 'mensual' && styles.filterTextActive]}>
          Mensual
        </ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.filterButton, timeFilter === 'trimestral' && styles.filterButtonActive]}
        onPress={() => setTimeFilter('trimestral')}
      >
        <ThemedText style={[styles.filterText, timeFilter === 'trimestral' && styles.filterTextActive]}>
          Trimestral
        </ThemedText>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.filterButton, timeFilter === 'anual' && styles.filterButtonActive]}
        onPress={() => setTimeFilter('anual')}
      >
        <ThemedText style={[styles.filterText, timeFilter === 'anual' && styles.filterTextActive]}>
          Anual
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title}>Dashboard Financiero</ThemedText>
        
        {/* Filtro de tiempo */}
        {renderTimeFilter()}
        
        {/* Sección de Balance */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Balance Actual</ThemedText>
          <ThemedText style={styles.balance}>${mockData.balance}</ThemedText>
          <ThemedView style={styles.budgetContainer}>
            <ThemedText style={styles.budgetLabel}>Presupuesto disponible:</ThemedText>
            <ThemedText style={styles.budgetAmount}>${presupuestoDisponible}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Resumen Ingresos/Gastos/Ahorros */}
        <ThemedView style={styles.row}>
          <ThemedView style={[styles.card, styles.thirdWidth, styles.incomeCard]}>
            <ThemedText style={styles.smallCardTitle}>Ingresos</ThemedText>
            <ThemedText style={styles.amountIncome}>+${mockData.ingresos}</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.card, styles.thirdWidth, styles.expenseCard]}>
            <ThemedText style={styles.smallCardTitle}>Gastos</ThemedText>
            <ThemedText style={styles.amountExpense}>-${mockData.gastos}</ThemedText>
          </ThemedView>
          
          <ThemedView style={[styles.card, styles.thirdWidth, styles.savingCard]}>
            <ThemedText style={styles.smallCardTitle}>Ahorros</ThemedText>
            <ThemedText style={styles.amountSaving}>${mockData.ahorros}</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Gráfico histórico */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Histórico Financiero</ThemedText>
          <LineChart
            data={chartData}
            width={Dimensions.get("window").width - 60}
            height={180}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
              }
            }}
            bezier
            style={styles.chart}
          />
        </ThemedView>

        {/* Meta de Ahorro */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Meta de Ahorro: {mockData.metaAhorro.nombre}</ThemedText>
          <ThemedView style={styles.progressContainer}>
            <ThemedView style={[styles.progressBar, { width: `${progresoAhorro}%` }]} />
          </ThemedView>
          <ThemedView style={styles.progressLabels}>
            <ThemedText style={styles.progressAmount}>${mockData.metaAhorro.actual}</ThemedText>
            <ThemedText style={styles.progressGoal}>Meta: ${mockData.metaAhorro.objetivo}</ThemedText>
          </ThemedView>
          <ThemedText style={styles.progressPercentage}>{Math.round(progresoAhorro)}% completado</ThemedText>
        </ThemedView>

        {/* Consejos financieros */}
        <ThemedView style={[styles.card, styles.tipsCard]}>
          <ThemedText style={styles.cardTitle}>Consejos personalizados</ThemedText>
          {mockData.consejosFinancieros.map((consejo, index) => (
            <ThemedView key={index} style={styles.tipItem}>
              <ThemedText style={styles.tipIcon}>💡</ThemedText>
              <ThemedText style={styles.tipText}>{consejo}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Próximos pagos */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Próximos pagos</ThemedText>
          {mockData.deudas.map((deuda, index) => (
            <ThemedView key={index} style={styles.debtItem}>
              <ThemedView style={styles.debtDetails}>
                <ThemedText style={styles.debtName}>{deuda.tipo}</ThemedText>
                <ThemedText style={styles.debtDate}>Vence: {deuda.fechaPago}</ThemedText>
              </ThemedView>
              <ThemedView style={styles.debtInfo}>
                <ThemedText style={styles.debtAmount}>${deuda.monto}</ThemedText>
                <ThemedText style={styles.debtRate}>Tasa: {deuda.tasa}</ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Gráfico de Distribución */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Distribución de Gastos</ThemedText>
          <ThemedView style={styles.chartContainer}>
            {mockData.categoriasGastos.map((categoria, index) => (
              <ThemedView 
                key={index}
                style={[
                  styles.chartBar,
                  { width: `${categoria.porcentaje}%`,
                    backgroundColor: getColorForCategory(index) }
                ]}
              />
            ))}
          </ThemedView>
          <ThemedView style={styles.legendContainer}>
            {mockData.categoriasGastos.map((categoria, index) => (
              <ThemedView key={index} style={styles.legendItem}>
                <ThemedView 
                  style={[
                    styles.legendColor,
                    { backgroundColor: getColorForCategory(index) }
                  ]}
                />
                <ThemedView style={styles.legendDetails}>
                  <ThemedText style={styles.legendText}>{categoria.nombre}</ThemedText>
                  <ThemedText style={styles.legendAmount}>${categoria.monto}</ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Lista de Transacciones */}
        <ThemedView style={styles.card}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={styles.cardTitle}>Últimas Transacciones</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.viewAllLink}>Ver todas</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          {mockData.transacciones.map((transaccion, index) => (
            <ThemedView key={index} style={styles.transactionItem}>
              <ThemedView style={[
                styles.transactionIcon,
                transaccion.tipo === 'ingreso' && styles.incomeIconBg,
                transaccion.tipo === 'gasto' && styles.expenseIconBg,
                transaccion.tipo === 'deuda' && styles.debtIconBg,
                transaccion.tipo === 'ahorro' && styles.savingIconBg,
              ]}>
                <ThemedText style={styles.transactionIconText}>
                  {getTransactionIcon(transaccion.tipo)}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.transactionDetails}>
                <ThemedView>
                  <ThemedText style={styles.transactionDesc}>{transaccion.descripcion}</ThemedText>
                  <ThemedText style={styles.transactionDate}>{transaccion.fecha}</ThemedText>
                </ThemedView>
                <ThemedText style={[
                  styles.transactionAmount,
                  transaccion.tipo === 'ingreso' && styles.incomeAmount,
                  transaccion.tipo === 'gasto' && styles.expenseAmount,
                  transaccion.tipo === 'deuda' && styles.debtAmount,
                  transaccion.tipo === 'ahorro' && styles.savingAmount
                ]}>
                  {transaccion.tipo === 'ingreso' ? '+' : transaccion.tipo === 'gasto' || transaccion.tipo === 'deuda' ? '-' : ''}${transaccion.monto}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
        
        {/* Botón de acción */}
        <TouchableOpacity style={styles.actionButton}>
          <ThemedText style={styles.actionButtonText}>+ Nueva transacción</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

// Funciones auxili
// ares
function getColorForCategory(index) {
  const colors = ['#4A90E2', '#50E3C2', '#F5A623', '#D0021B', '#9013FE', '#417505'];
  return colors[index % colors.length];
}

function getTransactionIcon(tipo) {
  switch(tipo) {
    case 'ingreso': return '💰';
    case 'gasto': return '🛒';
    case 'deuda': return '💳';
    case 'ahorro': return '🏦';
    default: return '•';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  scrollContainer: {
    paddingBottom: 80, // Espacio para el botón flotante
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  filterButtonActive: {
    backgroundColor: '#2E7D32',
  },
  filterText: {
    fontSize: 14,
    color: '#555',
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 10,
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 14,
    color: '#666',
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  thirdWidth: {
    width: '31%',
  },
  halfWidth: {
    width: '48%',
  },
  incomeCard: {
    backgroundColor: '#E8F5E9',
  },
  expenseCard: {
    backgroundColor: '#FFEBEE',
  },
  savingCard: {
    backgroundColor: '#E3F2FD',
  },
  amountIncome: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: '600',
    textAlign: 'center',
  },
  amountExpense: {
    fontSize: 20,
    color: '#C62828',
    fontWeight: '600',
    textAlign: 'center',
  },
  amountSaving: {
    fontSize: 20,
    color: '#1565C0',
    fontWeight: '600',
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  chartBar: {
    height: '100%',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendDetails: {
    flex: 1,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  legendAmount: {
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllLink: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressGoal: {
    fontSize: 14,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  tipsCard: {
    backgroundColor: '#FFF9C4',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#5D4037',
    lineHeight: 20,
  },
  debtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  debtDetails: {
    flex: 1,
  },
  debtName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  debtDate: {
    fontSize: 13,
    color: '#F44336',
  },
  debtInfo: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  debtRate: {
    fontSize: 13,
    color: '#666',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  incomeIconBg: {
    backgroundColor: '#E8F5E9',
  },
  expenseIconBg: {
    backgroundColor: '#FFEBEE',
  },
  debtIconBg: {
    backgroundColor: '#FFF3E0',
  },
  savingIconBg: {
    backgroundColor: '#E3F2FD',
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionDesc: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  incomeAmount: {
    color: '#2E7D32',
  },
  expenseAmount: {
    color: '#C62828',
  },
  debtAmount: {
    color: '#F9A825',
  },
  savingAmount: {
    color: '#1565C0',
  },
  actionButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});