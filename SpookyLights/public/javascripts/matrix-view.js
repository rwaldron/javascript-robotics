(function(){
    function MatrixView(elementId){
        this.elementId = elementId;
        this.matrixSize = 8;
        this.cellSize = 30;
        this.cellPadding = 2;
        this.squares = [];
        this.colors = ["Black","Chartreuse","Orange","OrangeRed"];

        var self = this;
        var toggleSquareColor = function(a){
            var square = this;
            var squareColor = square.data('color');
            squareColor = (squareColor + 1) % self.colors.length;
            square.data('color',squareColor);
            square.attr('fill',self.colors[squareColor]);
        };

        this.draw = function(){
            var currentX = this.cellPadding,
            currentY = this.cellPadding,
            paperDimension = this.matrixSize *
              (this.cellSize + this.cellPadding) + this.cellPadding,
            paper = Raphael(this.elementId,paperDimension,paperDimension);
            // draw matrix of squares using RaphaelJS
            for (var w = 0; w < this.matrixSize; w++){
                this.squares[w] = [];
                for (var h=0; h < this.matrixSize; h++){
                  var square = paper.rect(currentX, currentY, this.cellSize, this.cellSize)
                  .attr('stroke','white')
                  .attr('fill','black')
                  .data('w',w)
                  .data('h',h)
                  .data('color',0)
                  .click(toggleSquareColor);
                  this.squares[w].push(square);
                  currentX += (this.cellSize + this.cellPadding);
                }
                currentX = this.cellPadding;
                currentY += (this.cellSize + this.cellPadding);
            }
            return this;
        };

        this.reset = function(){
            for (var w = 0; w < this.matrixSize; w++){
              for (var h=0; h < this.matrixSize; h++){
                var square = this.squares[w][h];
                square.data('color',0);
                square.attr('fill',this.colors[0]);
              }
            }
            return this;
        };

        this.print = function(){
            return JSON.stringify(this.squares.map(
              function(a) {
                var colors =  a.map(
                    function(b){
                      return b.data('color');
                    }
                );
                var result = "";
                colors.forEach(function(color) {
                  result += color;
                });
                return result;
              }
            ));
        };
    }

    // draw the matrix UI
    var view = new MatrixView('matrix').draw();

    // attach actions to buttons
    $('.reset').click(function(){
      view.reset();
    });

    $('.send').click(function(){
      var device = $('.device').val();
      $.ajax({
        type: 'POST',
        url: '/lights/draw/' + device,
        data: view.print(),
        contentType: 'application/json',
        complete: function(xhr, status) {
          $('.status').html(xhr.response);
        }
      });
    });

    $('.clear').click(function(){
      var device = $('.device').val();
      $.ajax({
        type: 'POST',
        url: '/lights/clear/',
        contentType: 'application/json',
        complete: function(xhr, status) {
          $('.status').html(xhr.response);
        }
      });
    });
})();