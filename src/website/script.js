$(document).ready(() => {
	const showUrl = (queries, showAll = false) => {
		const baseUrl = 'webcal://filter-school-calendar.vojtech-fluger.workers.dev';
		if (showAll) {
			return baseUrl + '/spolecne';
		}
		let outputQuery;
		if (queries.aj) {
			outputQuery = '?aj=' + queries.aj;
		}
		if (queries.nj) {
			outputQuery = '?nj=' + queries.nj;
		}
		if (queries.aj && queries.nj) {
			outputQuery = '?aj=' + queries.aj + '&nj=' + queries.nj;
		}
		return baseUrl + outputQuery;
	};
	let queries = {};
	const updateQueryObject = (e) => {
		queries.aj = $('#aj-select option:selected').index() + 1;
		queries.nj = $('#nj-select option:selected').index() + 1;
		const queryOutput = showUrl(queries);
		$('.output-link').text(queryOutput).prop('href', queryOutput);
		$('.add-btn').prop('href', queryOutput);
	};
	updateQueryObject();
	$('select').on('change', updateQueryObject);

	const updateCheckbox = () => {
		if ($('#spolecne-checkbox:checked')[0]) {
			$('select').prop('disabled', true);
			const queryOutput = showUrl(queries, true);
			$('.output-link').text(queryOutput).prop('href', queryOutput);
			$('.add-btn').prop('href', queryOutput);
			$('.select-label').css('color', '#69696f');
			return;
		}
		$('.select-label').css('color', 'white');
		$('select').prop('disabled', false);
		updateQueryObject(queries);
	};
	updateCheckbox();
	$('#spolecne-checkbox').on('change', updateCheckbox);
	$('.copy-btn').on('click', () => {
		navigator.clipboard.writeText($('.output-link').attr('href')).then(
			function () {
				$('.copy-msg-container').css('opacity', 1);
				$('.copy-msg-container').css('transform', 'none');
				setTimeout(() => {
					$('.copy-msg-container').css('opacity', 0);
					$('.copy-msg-container').css('transform', 'translateY(-50px)');
				}, 2000);
			},
			function () {
				$('.copied-msg').html('<i class="fa fa-circle-xmark" style="color: #b30004"></i>Nepovedlo se zkopírovat odkaz');
				$('.copy-msg-container').css('opacity', 1);
				$('.copy-msg-container').css('transform', 'none');
				setTimeout(() => {
					$('.copy-msg-container').css('opacity', 0);
					$('.copy-msg-container').css('transform', 'translateY(-50px)');
				}, 2000);
			}
		);
	});
});
