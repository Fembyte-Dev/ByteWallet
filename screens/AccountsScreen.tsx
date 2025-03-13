import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function AccountsScreen() {
  const [activeTab, setActiveTab] = useState('todas');

  // Datos simulados de cuentas
  const cuentas = [
    {
      id: '1',
      tipo: 'cuenta_corriente',
      nombre: 'Cuenta Nómina',
      entidad: 'Banco Nacional',
      numero: '****4389',
      saldo: 4260.75,
      moneda: 'MXN',
      movimientos: 12,
      ultimaActualizacion: '12/03/2025',
      bankInitials: 'BN',
      color: '#4A90E2'
    },
    {
      id: '2',
      tipo: 'cuenta_ahorro',
      nombre: 'Ahorros Personales',
      entidad: 'Banco Financiero',
      numero: '****7522',
      saldo: 15840.30,
      moneda: 'MXN',
      movimientos: 5,
      ultimaActualizacion: '10/03/2025',
      bankInitials: 'BF',
      color: '#50E3C2'
    },
    {
      id: '3',
      tipo: 'tarjeta_credito',
      nombre: 'Tarjeta Gold',
      entidad: 'Banco Mercantil',
      numero: '****8125',
      saldo: -3240.50,
      limite: 5000.00,
      vencimiento: '15/03/2025',
      moneda: 'MXN',
      movimientos: 8,
      ultimaActualizacion: '11/03/2025',
      bankInitials: 'BM',
      color: '#F5A623'
    },
    {
      id: '4',
      tipo: 'cuenta_inversion',
      nombre: 'Fondo de Inversión',
      entidad: 'Inversora Global',
      numero: '****6129',
      saldo: 22450.00,
      rentabilidad: '+5.2%',
      moneda: 'MXN',
      movimientos: 2,
      ultimaActualizacion: '08/03/2025',
      bankInitials: 'IG',
      color: '#9013FE'
    }
  ];

  // Obtener el balance total de todas las cuentas
  const balanceTotal = cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);

  // Filtrar cuentas por tipo
  const getCuentasFiltradas = () => {
    if (activeTab === 'todas') return cuentas;
    return cuentas.filter(cuenta => cuenta.tipo === activeTab);
  };

  // Componente para los tabs
  const renderTabs = () => {
    const tabs = [
      { id: 'todas', label: 'Todas' },
      { id: 'cuenta_corriente', label: 'Corrientes' },
      { id: 'cuenta_ahorro', label: 'Ahorros' },
      { id: 'tarjeta_credito', label: 'Tarjetas' },
      { id: 'cuenta_inversion', label: 'Inversiones' }
    ];

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <ThemedText style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Renderizar una tarjeta de cuenta
  const renderCuentaItem = ({ item }) => {
    return (
      <TouchableOpacity style={[styles.cuentaCard, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
        <ThemedView style={styles.cuentaHeader}>
          <ThemedView style={[styles.bankInitialsContainer, { backgroundColor: item.color }]}>
            <ThemedText style={styles.bankInitialsText}>{item.bankInitials}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.cuentaTipo}>
            <ThemedText style={styles.cuentaTipoText}>
              {getTipoLabel(item.tipo)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedText style={styles.cuentaNombre}>{item.nombre}</ThemedText>
        <ThemedText style={styles.cuentaNumero}>{item.numero}</ThemedText>
        
        <ThemedView style={styles.cuentaInfo}>
          <ThemedView>
            <ThemedText style={styles.cuentaSaldoLabel}>Saldo disponible</ThemedText>
            <ThemedText style={[
              styles.cuentaSaldo,
              item.saldo < 0 && styles.cuentaSaldoNegativo
            ]}>
              {item.saldo.toLocaleString('es-MX', {
                style: 'currency',
                currency: item.moneda
              })}
            </ThemedText>
          </ThemedView>
          
          {item.tipo === 'tarjeta_credito' && (
            <ThemedView style={styles.tarjetaInfo}>
              <ThemedText style={styles.tarjetaInfoLabel}>Límite disponible</ThemedText>
              <ThemedText style={styles.tarjetaInfoValor}>
                {(item.limite + item.saldo).toLocaleString('es-MX', {
                  style: 'currency', 
                  currency: item.moneda
                })}
              </ThemedText>
              <ThemedText style={styles.tarjetaInfoVencimiento}>
                Vence: {item.vencimiento}
              </ThemedText>
            </ThemedView>
          )}
          
          {item.tipo === 'cuenta_inversion' && (
            <ThemedView style={styles.inversionInfo}>
              <ThemedText style={styles.inversionInfoLabel}>Rentabilidad</ThemedText>
              <ThemedText style={[
                styles.inversionInfoValor,
                parseFloat(item.rentabilidad) > 0 ? styles.rentabilidadPositiva : styles.rentabilidadNegativa
              ]}>
                {item.rentabilidad}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
        
        <ThemedView style={styles.cuentaFooter}>
          <ThemedText style={styles.cuentaMovimientos}>
            {item.movimientos} movimientos recientes
          </ThemedText>
          <ThemedText style={styles.cuentaActualizacion}>
            Actualizado: {item.ultimaActualizacion}
          </ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.cuentaActions}>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>Detalles</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ThemedText style={styles.actionButtonText}>Transferir</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  // Función para obtener la etiqueta según el tipo de cuenta
  const getTipoLabel = (tipo) => {
    switch(tipo) {
      case 'cuenta_corriente': return 'Cuenta Corriente';
      case 'cuenta_ahorro': return 'Cuenta Ahorro';
      case 'tarjeta_credito': return 'Tarjeta Crédito';
      case 'cuenta_inversion': return 'Inversión';
      default: return tipo;
    }
  };

  // Renderizar tarjetas resumen
  const renderTarjetasResumen = () => {
    // Calcular saldos por tipo de cuenta
    const saldoPositivo = cuentas
      .filter(cuenta => cuenta.saldo > 0)
      .reduce((total, cuenta) => total + cuenta.saldo, 0);
      
    const saldoNegativo = cuentas
      .filter(cuenta => cuenta.saldo < 0)
      .reduce((total, cuenta) => total + cuenta.saldo, 0);

    const tarjetas = [
      {
        title: 'Balance Total',
        value: balanceTotal.toLocaleString('es-ES', {style: 'currency', currency: 'MXN'}),
        color: '#2E7D32',
        background: '#E8F5E9'
      },
      {
        title: 'Saldo Positivo',
        value: saldoPositivo.toLocaleString('es-ES', {style: 'currency', currency: 'MXN'}),
        color: '#1565C0',
        background: '#E3F2FD'
      },
      {
        title: 'Deuda Total',
        value: Math.abs(saldoNegativo).toLocaleString('es-ES', {style: 'currency', currency: 'MXN'}),
        color: '#C62828',
        background: '#FFEBEE'
      }
    ];

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.resumenContainer}
        contentContainerStyle={styles.resumenContent}
      >
        {tarjetas.map((tarjeta, index) => (
          <ThemedView 
            key={index} 
            style={[styles.resumenCard, { backgroundColor: tarjeta.background }]}
          >
            <ThemedText style={styles.resumenTitle}>{tarjeta.title}</ThemedText>
            <ThemedText style={[styles.resumenValue, { color: tarjeta.color }]}>
              {tarjeta.value}
            </ThemedText>
          </ThemedView>
        ))}
      </ScrollView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {renderTabs()}
      <FlatList
        data={getCuentasFiltradas()}
        renderItem={renderCuentaItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton}>
        <ThemedText style={styles.addButtonText}>+ Agregar Cuenta</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32, // Added top padding for better spacing
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  listContainer: {
    paddingBottom: 16,
  },
  cuentaCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cuentaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankInitialsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankInitialsText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cuentaTipo: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cuentaTipoText: {
    fontSize: 12,
    color: '#666',
  },
  cuentaNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cuentaNumero: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cuentaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cuentaSaldoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  cuentaSaldo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cuentaSaldoNegativo: {
    color: '#C62828',
  },
  tarjetaInfo: {
    alignItems: 'flex-end',
  },
  tarjetaInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tarjetaInfoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tarjetaInfoVencimiento: {
    fontSize: 12,
    color: '#666',
  },
  inversionInfo: {
    alignItems: 'flex-end',
  },
  inversionInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  inversionInfoValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rentabilidadPositiva: {
    color: '#2E7D32',
  },
  rentabilidadNegativa: {
    color: '#C62828',
  },
  cuentaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cuentaMovimientos: {
    fontSize: 12,
    color: '#666',
  },
  cuentaActualizacion: {
    fontSize: 12,
    color: '#666',
  },
  cuentaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007AFF',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});