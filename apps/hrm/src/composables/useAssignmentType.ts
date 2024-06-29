import { useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toRef } from 'vue'

import { gradeOptions } from './settings/useEmployeeGrade'
import { branchesOptions } from '@/composables/settings/useBranch'
import { departmentsOptions } from '@/composables/settings/useDepartment'
import { categoriesOptions } from '@/composables/settings/useEmployeeCategory'
import { positionsOptions } from '@/composables/settings/useEmployeePosition'
import { typesOptions } from '@/composables/settings/useEmployeeType'

export enum AssignmentTypes {
  Branch = 'Branch',
  Department = 'Department',
  Type = 'Type',
  Category = 'Category',
  Grade = 'Grade',
  Position = 'Position',
}

export const useAssignmentType = (initialType: MaybeRefOrGetter<AssignmentTypes | undefined>) => {
  const options = Object.values(AssignmentTypes)
  const type = toRef(initialType)

  const { data: branches } = useQuery({
    ...branchesOptions(),
    enabled: () => type.value === 'Branch',
    select: data => data.list.map(branch => ({ value: branch.branchId, label: branch.branchName })),
  })

  const { data: departments } = useQuery({
    ...departmentsOptions(),
    enabled: () => type.value === 'Department',
    select: data => data.list.map(dep => ({ value: dep.depId, label: dep.depName })),
  })

  const { data: categories } = useQuery({
    ...categoriesOptions(),
    enabled: () => type.value === 'Category',
    select: data => data.list.map(cate => ({ value: cate.cateId, label: cate.cateName })),
  })

  const { data: positions } = useQuery({
    ...positionsOptions(),
    enabled: () => type.value === 'Position',
    select: data => data.list.map(pos => ({ value: pos.posId, label: pos.posName })),
  })

  const { data: types } = useQuery({
    ...typesOptions(),
    enabled: () => type.value === 'Type',
    select: data => data.list.map(type => ({ value: type.typeId, label: type.typeName })),
  })

  const { data: grades } = useQuery({
    ...gradeOptions(),
    enabled: () => type.value === 'Grade',
    select: data => data.list.map(type => ({ value: type.gradeId, label: type.gradeName })),
  })

  const detailOptions = computed(() => {
    if (type.value === 'Branch') return branches.value
    if (type.value === 'Department') return departments.value
    if (type.value === 'Type') return types.value
    if (type.value === 'Position') return positions.value
    if (type.value === 'Category') return categories.value
    if (type.value === 'Grade') return grades.value
    return []
  })

  return {
    options,
    detailOptions,
    type,
  }
}
