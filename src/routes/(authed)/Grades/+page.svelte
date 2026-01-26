<script lang="ts">
	import { removeCourseType } from '$lib';
	import { brand } from '$lib/brand';
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { parseSynergyAssignment } from '$lib/Grades/assignments';
	import {
		getReportPeriodName,
		gradebookState,
		switchReportPeriod
	} from '$lib/Grades/catalog.svelte';
	import { getActiveGradebook } from '$lib/Grades/gradebook';
	import { seenAssignmentIDs } from '$lib/Grades/seenAssignments.svelte';
	import type { Course } from '$lib/types/Gradebook';
	import CircleXIcon from '@lucide/svelte/icons/circle-x';
	import CourseButton from './CourseButton.svelte';
	import ReportPeriodSwitcher from './ReportPeriodSwitcher.svelte';
	import { fade, scale, slide } from 'svelte/transition';

	const gradebookCatalog = $derived(gradebookState.gradebookCatalog);

	const gradebook = $derived(getActiveGradebook());

	const activeReportPeriod = $derived(gradebook?.ReportingPeriod);

	const activeReportPeriodIndex = $derived(
		gradebookCatalog ? (gradebookCatalog.overrideIndex ?? gradebookCatalog.defaultIndex) : undefined
	);

	const courses = $derived(gradebook?.Courses.Course);

	function getCourseUnseenAssignmentsCount(course: Course) {
		if (course.Marks === '') return 0;

		const assignments = course.Marks.Mark.Assignments.Assignment;
		if (!assignments) return 0;

		return assignments.map(parseSynergyAssignment).filter(({ id }: { id: string }) => !seenAssignmentIDs.has(id))
			.length;
	}

	function getCourseGrade(course: Course) {
		if (course.Marks === '') return;

		return {
			letter: course.Marks.Mark._CalculatedScoreString,
			percentage: parseFloat(course.Marks.Mark._CalculatedScoreRaw)
		};
	}

	const hasNoGrades = $derived(
		courses
			? courses
					.map((course: Course) => (course.Marks === '' ? 'N/A' : course.Marks.Mark._CalculatedScoreString))
					.every((score: string) => score === 'N/A')
			: false
	);

	const totalUnseenAssignments = $derived.by(() => {
		if (!courses) return 0;

		return courses.reduce((total: number, course: Course) => {
			return total + getCourseUnseenAssignmentsCount(course);
		}, 0);
	});

	const clearCourseUnseenAssignments = (course: Course) => {
		if (course.Marks === '') return;
		const assignments = course.Marks.Mark.Assignments.Assignment;
		if (!assignments) return;

		assignments.map(parseSynergyAssignment).forEach(({ id }: { id: string }) => seenAssignmentIDs.add(id));
	};

	const clearAllUnseenAssignments = (courses: Course[]) =>
		courses.forEach(clearCourseUnseenAssignments);
</script>

<svelte:head>
	<title>Grades - {brand}</title>
</svelte:head>

{#if activeReportPeriod && activeReportPeriodIndex !== undefined && gradebook}
	<div class="m-4 space-y-6 pb-8 animate-in fade-in duration-500" in:fade={{ duration: 300 }}>
		<div class="pt-4 animate-in slide-in-from-top-2 duration-500">
			<ReportPeriodSwitcher
				activeName={activeReportPeriod._GradePeriod}
				activeIndex={activeReportPeriodIndex}
				reportPeriods={gradebookCatalog?.canonicalReportPeriodEntries ??
					gradebook.ReportingPeriods.ReportPeriod}
				switchReportPeriod={(index) => switchReportPeriod({ overrideIndex: index })}
				hasReportPeriodCached={(index) => gradebookCatalog?.recordCache[index] !== undefined}
				disabled={gradebookCatalog?.loadingIndex !== undefined}
				defaultIndex={gradebookCatalog?.defaultIndex}
			/>
		</div>

		{#if hasNoGrades}
			<div in:scale={{ start: 0.95, duration: 300 }}>
				<Alert.Root class="mx-auto flex w-fit items-center animate-in fade-in slide-in-from-top-3 duration-500">
					<CircleXIcon class="shrink-0" />
					It looks like you don't have any grades yet in {activeReportPeriod._GradePeriod}.

					{#if activeReportPeriodIndex > 0}
						<Button
							onclick={() => switchReportPeriod({ overrideIndex: activeReportPeriodIndex - 1 })}
							variant="outline"
							class="transition-all duration-300 hover:scale-105"
						>
							View {getReportPeriodName(activeReportPeriodIndex - 1)}
						</Button>
					{/if}
				</Alert.Root>
			</div>
		{/if}

		<ol class="flex flex-col items-center gap-6">
			{#each courses as course, index (course._CourseID)}
				<li 
					class="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-3 duration-500"
					style="animation-delay: {index * 50}ms"
				>
					<CourseButton
						{index}
						name={removeCourseType(course._CourseName)}
						period={course._Period}
						room={course._Room}
						teacher={course._Staff}
						teacherEmail={course._StaffEMail}
						unseenAssignmentsCount={getCourseUnseenAssignmentsCount(course)}
						grade={getCourseGrade(course)}
					/>
				</li>
			{/each}
		</ol>

		{#if courses && totalUnseenAssignments > 0}
			<div in:scale={{ start: 0.95, duration: 400 }}>
				<Alert.Root class="mx-auto flex w-fit items-center gap-4 shadow-lg/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<Alert.Title class="tracking-normal">
						{totalUnseenAssignments} new assignment{totalUnseenAssignments === 1 ? '' : 's'}
					</Alert.Title>
					<Button 
						variant="outline" 
						onclick={() => clearAllUnseenAssignments(courses)}
						class="transition-all duration-300 hover:scale-105"
					>
						Mark as seen
					</Button>
				</Alert.Root>
			</div>
		{/if}
	</div>
{/if}
