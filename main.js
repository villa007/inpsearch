$(document).ready(function(){
    startApp({data: data});
});

var data = ['Kaka', 'Ronaldo', 'Benzema', 'Zidane', 'Villa'];

function startApp(options) {
    var listClass = options.listClass || 'list';
    var data = options.data || {};
    var list = '.' + listClass;
    var ulPattern = '<ul class="{class}"></ul>';
    var liPattern = '<li data-item="{item}"></li>';
    var noSuggClass = 'no-suggestion';
    var noSuggEl = '<li class="{class}">no suggestions</li>'.replace('{class}', noSuggClass);
    var firstLoad = true;

    // Generate list
    // @todo replace input with common var
    var listSelector = $('.input')
                           .parent()
                               .append(ulPattern.replace('{class}', listClass))
                                    .find(list);
    for (var i in data) {
        listSelector.append(liPattern.replace('{item}', data[i]));
    }
    listSelector.append(noSuggEl);

    $('.input').on('keyup', function(){
        var searchStr = $(this).val();
        // Initialize sizes once only
        var inputWidth = $(this).outerWidth();
        if (firstLoad) {
            var left = $(this).offset().left;
            var top = $(this).offset().top + $(this).outerHeight();
            listSelector.outerWidth(inputWidth);
            listSelector.offset({
                top: top,
                left: left
            });
            firstLoad = false;
        }

        // Perform insensitive search for typed text
        var foundCount = 0;
        $(list + ' li').each(function(){
            // Check all items except default
            if (!$(this).hasClass('.' + noSuggClass)) {
                var listValue = $(this).data('item');
                var regexp = new RegExp(searchStr, 'i');
                if (regexp.test(listValue) && searchStr.length > 0) {
                    var text = listValue.replace(searchStr, '<span class="highlight">' + searchStr +'</span>');
                    $(this).html(text);
                    $(this).show();
                    foundCount++;
                    // Show parent block
                } else {
                    $(this).hide();
                }
            }
        });

        // Show default item if nothing was found
        if (foundCount === 0) {
            listSelector
                .find('.' + noSuggClass).show();
        }
        if (!listSelector.hasClass('list-border')) {
            listSelector.addClass('list-border')
        }
    });

    // Add highlighted value to input
    $(document).on('click', list + ' li', function(){
        var hintValue = $(this).data('item');
        $('.input').val(hintValue);

        // Hide all list items
        listSelector.find('li').hide();

        // Hide parent
        listSelector.removeClass('list-border');
    })
}