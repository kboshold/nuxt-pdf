<script setup lang="ts">
import { computed } from 'vue'

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
}

const props = defineProps<{
  company: string
  recipient: string
  items: LineItem[]
  taxRate: number
}>()

const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
const invoiceDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const subtotal = computed(() =>
  props.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
)
const tax = computed(() => subtotal.value * props.taxRate / 100)
const total = computed(() => subtotal.value + tax.value)

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value)
}
</script>

<template>
  <div class="p-10 text-sm text-gray-800">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xl font-bold text-gray-900">
          {{ company }}
        </p>
        <p class="mt-1 text-xs text-gray-500">
          123 Main Street<br>10115 Berlin, Germany<br>tax@example.com
        </p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold uppercase tracking-wide text-blue-700">
          Invoice
        </p>
        <p class="mt-1 text-xs text-gray-500">
          {{ invoiceNumber }}<br>{{ invoiceDate }}
        </p>
      </div>
    </div>

    <!-- Recipient -->
    <div class="mt-8">
      <p class="text-xs uppercase text-gray-400">
        Bill To
      </p>
      <p class="mt-1 whitespace-pre-line font-medium">
        {{ recipient }}
      </p>
    </div>

    <!-- Line items table -->
    <table class="mt-8 w-full border-collapse">
      <thead>
        <tr class="border-b-2 border-gray-300 text-left text-xs uppercase text-gray-500">
          <th class="pb-2">
            Description
          </th>
          <th class="pb-2 text-right">
            Qty
          </th>
          <th class="pb-2 text-right">
            Unit Price
          </th>
          <th class="pb-2 text-right">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, i) in items"
          :key="i"
          class="border-b border-gray-200"
        >
          <td class="py-2">
            {{ item.description }}
          </td>
          <td class="py-2 text-right">
            {{ item.quantity }}
          </td>
          <td class="py-2 text-right">
            {{ formatCurrency(item.unitPrice) }}
          </td>
          <td class="py-2 text-right">
            {{ formatCurrency(item.quantity * item.unitPrice) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="ml-auto mt-4 w-64">
      <div class="flex justify-between border-b border-gray-200 py-1">
        <span class="text-gray-500">Subtotal</span>
        <span>{{ formatCurrency(subtotal) }}</span>
      </div>
      <div class="flex justify-between border-b border-gray-200 py-1">
        <span class="text-gray-500">Tax ({{ taxRate }}%)</span>
        <span>{{ formatCurrency(tax) }}</span>
      </div>
      <div class="flex justify-between py-2 text-base font-bold">
        <span>Total</span>
        <span>{{ formatCurrency(total) }}</span>
      </div>
    </div>

    <!-- Payment terms -->
    <div class="mt-12 border-t border-gray-200 pt-4 text-xs text-gray-400">
      <p class="font-medium text-gray-500">
        Payment Terms
      </p>
      <p class="mt-1">
        Payment is due within 30 days of the invoice date. Please transfer the amount to:<br>
        IBAN: DE89 3704 0044 0532 0130 00 · BIC: COBADEFFXXX · {{ company }}
      </p>
    </div>
  </div>
</template>
