$(document).ready(function() {
    var nome_usuario, nome_repositorio;
    var repositorios;
    $("#btn_pesquisar_repositorios").click(function(e) {
        e.preventDefault();
        nome_usuario = $("#nome_usuario").val();
        nome_repositorio = $("#nome_repositorio").val();
        $.ajax({
            dataType: "json",
            url: "https://api.github.com/users/" + nome_usuario + "/repos",
            success: function(dados) {
                repositorios = dados;
                $("tbody").html('');
                $.each(repositorios, function(key, value) {
                    $("tbody").append(
                        "<tr><th scope = 'row' > " + value.id + "</th> <td>" + value.name + "</td> <td> Otto </td> <td> @mdo </td> </tr> "
                    );
                });

            },
            error: function(erro) {
                alert(erro);
            }
        });
    });
});